/**
 * TableBite - Vercel Serverless Function API Handler
 * Handles all REST API routes (/api/*) when deployed on Vercel.
 */

const { supabaseDb } = require('../supabase.js');
const QRCode = require('../qr-generator.js');

// Helper to send JSON responses in Vercel serverless environment
function sendJson(res, statusCode, data) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(statusCode).json(data);
}

module.exports = async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const method = req.method;

  try {
    // --- 1. GET /api/menu ---
    if (pathname === '/api/menu' && method === 'GET') {
      const { categories, products } = await supabaseDb.getMenu();
      const formattedProducts = (products || []).map(p => ({
        id: p.id,
        categoryId: p.category_id,
        name: p.name,
        description: p.description,
        price: Number(p.base_price),
        image: p.image_url,
        isVeg: Boolean(p.is_veg),
        isSpicy: Boolean(p.is_spicy),
        isBestseller: Boolean(p.is_bestseller),
        isAvailable: Boolean(p.is_available),
        portions: typeof p.portions === 'string' ? JSON.parse(p.portions) : (p.portions || []),
        addons: typeof p.addons === 'string' ? JSON.parse(p.addons) : (p.addons || [])
      }));

      return sendJson(res, 200, {
        success: true,
        categories: categories || [],
        products: formattedProducts
      });
    }

    // --- 2. GET /api/tables ---
    if (pathname === '/api/tables' && method === 'GET') {
      const tables = await supabaseDb.getTables();
      return sendJson(res, 200, { success: true, count: tables.length, tables });
    }

    // --- 3. GET /api/tables/:tableNumber/qr ---
    if (pathname.startsWith('/api/tables/') && pathname.endsWith('/qr') && method === 'GET') {
      const tableNumber = pathname.split('/')[3];
      const table = await supabaseDb.getTableByNumber(tableNumber);
      if (!table) {
        return sendJson(res, 404, { success: false, message: `Table ${tableNumber} not found` });
      }
      const host = req.headers.host || 'localhost';
      const targetUrl = `https://${host}/?table=${table.table_number}&token=${table.qr_token}`;
      const svg = QRCode.generateSVG(targetUrl, { cellSize: 6, margin: 4 });
      return sendJson(res, 200, {
        success: true,
        tableNumber: table.table_number,
        url: targetUrl,
        svg
      });
    }

    // --- 4. POST /api/orders (Create Order) ---
    if (pathname === '/api/orders' && method === 'POST') {
      const body = req.body || {};
      const { tableNumber, customerName, customerPhone, paymentMethod, specialInstructions, items } = body;

      if (!tableNumber || !items || !Array.isArray(items) || items.length === 0) {
        return sendJson(res, 400, { success: false, message: 'Table number and non-empty items are required' });
      }

      // Calculate totals
      let subtotal = 0;
      const verifiedItems = [];

      const { products } = await supabaseDb.getMenu();
      const productMap = new Map((products || []).map(p => [p.id, p]));

      for (const item of items) {
        const product = productMap.get(item.productId);
        if (!product) {
          return sendJson(res, 400, { success: false, message: `Product ${item.productId} not found` });
        }

        let itemPrice = Number(product.base_price);
        const quantity = parseInt(item.quantity, 10) || 1;
        const itemTotal = itemPrice * quantity;
        subtotal += itemTotal;

        verifiedItems.push({
          product_id: product.id,
          item_name: product.name,
          unit_price: itemPrice,
          quantity,
          selected_portion: item.portion || null,
          selected_addons: item.addons || [],
          item_total: itemTotal,
          special_note: item.specialNote || null
        });
      }

      const settings = await supabaseDb.getSettings();
      const taxPercent = parseFloat(settings.tax_percent) || 5;
      const taxAmount = Math.round(subtotal * (taxPercent / 100));
      const grandTotal = subtotal + taxAmount;
      const orderNumber = `#TB-${Math.floor(1000 + Math.random() * 9000)}`;

      const orderPayload = {
        order_number: orderNumber,
        table_number: String(tableNumber),
        customer_name: customerName || 'Diner',
        customer_phone: customerPhone || null,
        status: 'new',
        payment_method: paymentMethod || 'upi_qr',
        payment_status: (paymentMethod === 'cash_counter' || paymentMethod === 'upi_qr') ? 'pending' : 'paid',
        subtotal,
        tax_amount: taxAmount,
        total_amount: grandTotal,
        special_instructions: specialInstructions || null
      };

      const createdOrder = await supabaseDb.createOrder(orderPayload, verifiedItems);
      return sendJson(res, 201, {
        success: true,
        message: 'Order created successfully',
        order: createdOrder
      });
    }

    // --- 5. GET /api/orders (List Orders) ---
    if (pathname === '/api/orders' && method === 'GET') {
      const orders = await supabaseDb.getOrders();
      return sendJson(res, 200, { success: true, count: orders.length, orders });
    }

    // --- 6. GET /api/orders/:id ---
    if (pathname.startsWith('/api/orders/') && !pathname.endsWith('/status') && !pathname.endsWith('/pay') && method === 'GET') {
      const orderId = pathname.split('/')[3];
      const order = await supabaseDb.getOrderById(orderId);
      if (!order) {
        return sendJson(res, 404, { success: false, message: 'Order not found' });
      }
      return sendJson(res, 200, { success: true, order });
    }

    // --- 7. PATCH /api/orders/:id/status ---
    if (pathname.startsWith('/api/orders/') && pathname.endsWith('/status') && method === 'PATCH') {
      const orderId = pathname.split('/')[3];
      const { status } = req.body || {};
      const updated = await supabaseDb.updateOrderStatus(orderId, status);
      return sendJson(res, 200, { success: true, message: `Status updated to ${status}`, order: updated });
    }

    // --- 8. POST /api/orders/:id/pay ---
    if (pathname.startsWith('/api/orders/') && pathname.endsWith('/pay') && method === 'POST') {
      const orderId = pathname.split('/')[3];
      const { paymentMethod, transactionRef } = req.body || {};
      const updated = await supabaseDb.confirmPayment(orderId, paymentMethod, transactionRef);
      return sendJson(res, 200, { success: true, message: 'Payment confirmed', order: updated });
    }

    // --- 9. GET /api/settings ---
    if (pathname === '/api/settings' && method === 'GET') {
      const settings = await supabaseDb.getSettings();
      return sendJson(res, 200, { success: true, settings });
    }

    // --- 10. PUT /api/settings ---
    if (pathname === '/api/settings' && (method === 'PUT' || method === 'POST')) {
      const updated = await supabaseDb.updateSettings(req.body || {});
      return sendJson(res, 200, { success: true, message: 'Settings saved', settings: updated });
    }

    // --- 11. POST /api/auth/login ---
    if (pathname === '/api/auth/login' && method === 'POST') {
      const { username, password, pin } = req.body || {};
      const isPinMatch = pin === '1234';
      const isCredsMatch = (username === 'admin' || username === 'admin@tablebite.com') && (password === 'admin123' || password === 'admin');

      if (isPinMatch || isCredsMatch) {
        const token = `tb_auth_${Date.now()}_token`;
        return sendJson(res, 200, { success: true, token, user: { role: 'admin', username: username || 'Kitchen Staff' } });
      }
      return sendJson(res, 401, { success: false, message: 'Invalid PIN or credentials' });
    }

    // 404 for unknown API
    return sendJson(res, 404, { success: false, message: `Route ${pathname} not found` });

  } catch (error) {
    console.error('[Vercel API Error]', error);
    return sendJson(res, 500, { success: false, message: error.message || 'Serverless error' });
  }
};
