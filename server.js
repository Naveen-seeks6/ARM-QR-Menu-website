/**
 * TableBite - Production REST API & Static Server
 * Built with native Node.js HTTP & SQLite for maximum performance and zero external dependencies.
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { db, initDatabase } = require('./db.js');
const QRCode = require('./qr-generator.js');

// Ensure database is initialized
initDatabase();

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

// In-memory Rate Limiter (Phase 6 Security)
const rateLimitMap = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + 60000 };
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + 60000;
  } else {
    record.count++;
  }
  rateLimitMap.set(ip, record);
  return record.count <= 120; // Allow up to 120 requests/minute per IP
}

/**
 * Helper to send JSON responses with production security headers
 */
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  });
  res.end(JSON.stringify(data));
}

/**
 * Parse JSON request body
 */
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // Guard against huge payload attacks (> 1MB)
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

// ==========================================
// HTTP Request Router
// ==========================================
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // Rate Limiting for API routes (Phase 6 Security)
  if (pathname.startsWith('/api/')) {
    const ip = req.socket.remoteAddress || '127.0.0.1';
    if (!checkRateLimit(ip)) {
      return sendJson(res, 429, { success: false, message: 'Too many requests. Please slow down.' });
    }
  }

  try {
    // ==========================================
    // 1. API ROUTES (/api/*)
    // ==========================================

    // --- GET /api/menu ---
    if (pathname === '/api/menu' && method === 'GET') {
      const categories = db.prepare('SELECT * FROM categories ORDER BY display_order ASC').all();
      const rawProducts = db.prepare('SELECT * FROM products ORDER BY category_id, is_bestseller DESC').all();

      const products = rawProducts.map(p => ({
        id: p.id,
        categoryId: p.category_id,
        name: p.name,
        description: p.description,
        price: p.base_price,
        image: p.image_url,
        isVeg: Boolean(p.is_veg),
        isSpicy: Boolean(p.is_spicy),
        isBestseller: Boolean(p.is_bestseller),
        isAvailable: Boolean(p.is_available),
        portions: JSON.parse(p.portions || '[]'),
        addons: JSON.parse(p.addons || '[]')
      }));

      return sendJson(res, 200, {
        success: true,
        categories,
        products
      });
    }

    // --- GET /api/tables ---
    if (pathname === '/api/tables' && method === 'GET') {
      const tables = db.prepare('SELECT id, table_number, qr_token, capacity, status, created_at FROM tables ORDER BY CAST(table_number AS INT) ASC').all();
      return sendJson(res, 200, { success: true, count: tables.length, tables });
    }

    // --- GET /api/tables/:tableNumber ---
    if (pathname.startsWith('/api/tables/') && !pathname.endsWith('/qr') && method === 'GET') {
      const tableNumber = pathname.split('/')[3];
      const table = db.prepare('SELECT * FROM tables WHERE table_number = ?').get(tableNumber);
      if (!table) {
        return sendJson(res, 404, { success: false, message: `Table ${tableNumber} not found` });
      }
      return sendJson(res, 200, { success: true, table });
    }

    // --- GET /api/tables/:tableNumber/qr ---
    if (pathname.startsWith('/api/tables/') && pathname.endsWith('/qr') && method === 'GET') {
      const tableNumber = pathname.split('/')[3];
      const table = db.prepare('SELECT * FROM tables WHERE table_number = ?').get(tableNumber);
      if (!table) {
        return sendJson(res, 404, { success: false, message: `Table ${tableNumber} not found` });
      }
      const host = req.headers.host || `localhost:${PORT}`;
      const targetUrl = `http://${host}/?table=${table.table_number}&token=${table.qr_token}`;
      const svg = QRCode.generateSVG(targetUrl, { cellSize: 6, margin: 4 });
      return sendJson(res, 200, {
        success: true,
        tableNumber: table.table_number,
        url: targetUrl,
        svg
      });
    }

    // --- POST /api/orders (Create Order) ---
    if (pathname === '/api/orders' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { tableNumber, customerName, customerPhone, paymentMethod, specialInstructions, items } = body;

      if (!tableNumber || !items || !Array.isArray(items) || items.length === 0) {
        return sendJson(res, 400, { success: false, message: 'Table number and non-empty items array are required' });
      }

      // Verify table exists
      const table = db.prepare('SELECT * FROM tables WHERE table_number = ?').get(tableNumber.toString());
      if (!table) {
        return sendJson(res, 400, { success: false, message: `Invalid table number ${tableNumber}` });
      }

      // Server-side validation and price calculation
      let subtotal = 0;
      const verifiedOrderItems = [];

      for (const item of items) {
        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.productId);
        if (!product) {
          return sendJson(res, 400, { success: false, message: `Product ${item.productId} not found` });
        }

        if (!product.is_available) {
          return sendJson(res, 400, { success: false, message: `Dish "${product.name}" is currently sold out` });
        }

        const portions = JSON.parse(product.portions || '[]');
        const addons = JSON.parse(product.addons || '[]');

        // Determine portion price
        let itemBasePrice = product.base_price;
        let selectedPortionName = null;
        if (item.portion) {
          const matchedPortion = portions.find(p => p.name === item.portion);
          if (matchedPortion) {
            itemBasePrice = matchedPortion.price;
            selectedPortionName = matchedPortion.name;
          }
        }

        // Determine addons price
        let addonsTotal = 0;
        const verifiedAddons = [];
        if (item.addons && Array.isArray(item.addons)) {
          item.addons.forEach(userAddon => {
            const matchedAddon = addons.find(a => a.name === userAddon.name);
            if (matchedAddon) {
              addonsTotal += matchedAddon.price;
              verifiedAddons.push({ name: matchedAddon.name, price: matchedAddon.price });
            }
          });
        }

        const quantity = parseInt(item.quantity, 10) || 1;
        const unitPrice = itemBasePrice + addonsTotal;
        const itemTotal = unitPrice * quantity;
        subtotal += itemTotal;

        verifiedOrderItems.push({
          id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          productId: product.id,
          name: product.name,
          unitPrice,
          quantity,
          portion: selectedPortionName,
          addons: JSON.stringify(verifiedAddons),
          itemTotal,
          specialNote: item.specialNote || null
        });
      }

      // Calculate tax from settings (defaults to 5% GST)
      let taxPercent = 5;
      try {
        const taxRow = db.prepare("SELECT value FROM settings WHERE key = 'tax_percent'").get();
        if (taxRow && taxRow.value) taxPercent = parseFloat(taxRow.value) || 5;
      } catch (e) {}

      const taxAmount = Math.round(subtotal * (taxPercent / 100));
      const grandTotal = subtotal + taxAmount;
      const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const orderNumber = `#TB-${Math.floor(1000 + Math.random() * 9000)}`;

      // Insert Order into Database
      // UPI intent on mobile or Cash at counter starts pending until verified
      const initialPaymentStatus = (paymentMethod === 'cash_counter' || paymentMethod === 'upi_qr') ? 'pending' : 'paid';

      db.prepare(`
        INSERT INTO orders (
          id, order_number, table_number, customer_name, customer_phone,
          status, payment_method, payment_status, subtotal, tax_amount, total_amount, special_instructions
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        orderId,
        orderNumber,
        tableNumber.toString(),
        customerName || 'Diner',
        customerPhone || null,
        'new',
        paymentMethod || 'upi_intent',
        initialPaymentStatus,
        subtotal,
        taxAmount,
        grandTotal,
        specialInstructions || null
      );

      // Insert line items
      const insertItem = db.prepare(`
        INSERT INTO order_items (
          id, order_id, product_id, item_name, unit_price, quantity, selected_portion, selected_addons, item_total, special_note
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      verifiedOrderItems.forEach(oi => {
        insertItem.run(
          oi.id,
          orderId,
          oi.productId,
          oi.name,
          oi.unitPrice,
          oi.quantity,
          oi.portion,
          oi.addons,
          oi.itemTotal,
          oi.specialNote
        );
      });

      // Update table occupancy status
      db.prepare('UPDATE tables SET status = ? WHERE table_number = ?').run('occupied', tableNumber.toString());

      console.log(`[Order] New order placed: ${orderNumber} for Table ${tableNumber} - Total: ₹${grandTotal}`);

      return sendJson(res, 201, {
        success: true,
        message: 'Order created successfully',
        order: {
          id: orderId,
          orderNumber,
          tableNumber,
          customerName,
          status: 'new',
          paymentMethod,
          paymentStatus: paymentMethod === 'cash_counter' ? 'pending' : 'paid',
          subtotal,
          taxAmount,
          grandTotal,
          items: verifiedOrderItems
        }
      });
    }

    // --- GET /api/orders (List all orders with items) ---
    if (pathname === '/api/orders' && method === 'GET') {
      const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 50').all();
      const getItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?');

      const fullOrders = orders.map(o => ({
        ...o,
        items: getItems.all(o.id).map(i => ({
          ...i,
          selected_addons: JSON.parse(i.selected_addons || '[]')
        }))
      }));

      return sendJson(res, 200, { success: true, count: fullOrders.length, orders: fullOrders });
    }

    // --- GET /api/orders/:id ---
    if (pathname.startsWith('/api/orders/') && method === 'GET') {
      const orderIdentifier = pathname.split('/')[3];
      const order = db.prepare('SELECT * FROM orders WHERE id = ? OR order_number = ?').get(orderIdentifier, orderIdentifier);
      if (!order) {
        return sendJson(res, 404, { success: false, message: 'Order not found' });
      }
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
      return sendJson(res, 200, {
        success: true,
        order: {
          ...order,
          items: items.map(i => ({
            ...i,
            selected_addons: JSON.parse(i.selected_addons || '[]')
          }))
        }
      });
    }

    // --- PATCH /api/orders/:id/status (Advance Order Status) ---
    if (pathname.startsWith('/api/orders/') && pathname.endsWith('/status') && method === 'PATCH') {
      const orderId = pathname.split('/')[3];
      const body = await parseJsonBody(req);
      const { status } = body;

      const validStatuses = ['new', 'in_kitchen', 'ready', 'served', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return sendJson(res, 400, { success: false, message: `Invalid status. Allowed: ${validStatuses.join(', ')}` });
      }

      const info = db.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ? OR order_number = ?").run(status, orderId, orderId);
      if (info.changes === 0) {
        return sendJson(res, 404, { success: false, message: 'Order not found' });
      }

      return sendJson(res, 200, { success: true, message: `Order status updated to ${status}`, status });
    }

    // --- POST /api/orders/:id/pay (Payment Confirmation & Webhook - Phase 5) ---
    if (pathname.startsWith('/api/orders/') && pathname.endsWith('/pay') && method === 'POST') {
      const orderId = pathname.split('/')[3];
      const body = await parseJsonBody(req);
      const { paymentMethod, transactionRef } = body;

      const order = db.prepare('SELECT * FROM orders WHERE id = ? OR order_number = ?').get(orderId, orderId);
      if (!order) {
        return sendJson(res, 404, { success: false, message: 'Order not found' });
      }

      db.prepare(`
        UPDATE orders 
        SET payment_status = 'paid', 
            payment_method = COALESCE(?, payment_method),
            updated_at = datetime('now') 
        WHERE id = ?
      `).run(paymentMethod || 'upi_qr', order.id);

      console.log(`[Payment] Order ${order.order_number} marked PAID via ${paymentMethod || 'upi_qr'} (Ref: ${transactionRef || 'N/A'})`);

      return sendJson(res, 200, {
        success: true,
        message: 'Payment confirmed successfully',
        orderNumber: order.order_number,
        paymentStatus: 'paid',
        transactionRef: transactionRef || null
      });
    }

    // --- GET /api/settings (Shop Onboarding & Configuration - Phase 6) ---
    if (pathname === '/api/settings' && method === 'GET') {
      const rows = db.prepare('SELECT key, value FROM settings').all();
      const settings = {};
      rows.forEach(r => { settings[r.key] = r.value; });
      return sendJson(res, 200, { success: true, settings });
    }

    // --- PUT /api/settings (Update Shop Onboarding Settings - Phase 6) ---
    if (pathname === '/api/settings' && (method === 'PUT' || method === 'POST')) {
      const body = await parseJsonBody(req);
      const updateStmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
      Object.entries(body).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          updateStmt.run(k, v.toString());
        }
      });
      const rows = db.prepare('SELECT key, value FROM settings').all();
      const settings = {};
      rows.forEach(r => { settings[r.key] = r.value; });
      return sendJson(res, 200, { success: true, message: 'Settings saved successfully', settings });
    }

    // --- PATCH /api/products/:id/toggle-stock (86 Sold Out Toggle) ---
    if (pathname.startsWith('/api/products/') && pathname.endsWith('/toggle-stock') && method === 'PATCH') {
      const productId = pathname.split('/')[3];
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
      if (!product) {
        return sendJson(res, 404, { success: false, message: 'Product not found' });
      }

      const newStatus = product.is_available ? 0 : 1;
      db.prepare('UPDATE products SET is_available = ? WHERE id = ?').run(newStatus, productId);

      return sendJson(res, 200, {
        success: true,
        productId,
        isAvailable: Boolean(newStatus),
        message: `Product "${product.name}" is now ${newStatus ? 'In Stock' : 'Sold Out'}`
      });
    }

    // --- POST /api/auth/login ---
    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { username, password, pin } = body;

      // Allow login via email/password or quick PIN
      const isPinMatch = pin === '1234';
      const isCredsMatch = (username === 'admin' || username === 'admin@tablebite.com') && (password === 'admin123' || password === 'admin');

      if (isPinMatch || isCredsMatch) {
        return sendJson(res, 200, {
          success: true,
          token: `tb_admin_${Date.now()}_auth_token`,
          user: {
            name: 'Vikram Mehta',
            email: 'admin@tablebite.com',
            role: 'owner',
            restaurant: 'TableBite Bistro'
          }
        });
      } else {
        return sendJson(res, 401, {
          success: false,
          message: 'Invalid credentials. Use admin@tablebite.com / admin123 or PIN 1234'
        });
      }
    }

    // --- GET /api/admin/analytics ---
    if (pathname === '/api/admin/analytics' && method === 'GET') {
      // 1. Total revenue
      const revRow = db.prepare("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status != 'cancelled'").get();
      const totalRevenue = Math.round(revRow.total);

      // 2. Total orders
      const orderCountRow = db.prepare('SELECT COUNT(*) as count FROM orders').get();
      const totalOrders = orderCountRow.count;

      // 3. Average order value (AOV)
      const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

      // 4. Active kitchen orders (new, in_kitchen, ready)
      const activeOrdersRow = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status IN ('new', 'in_kitchen', 'ready')").get();
      const activeOrdersCount = activeOrdersRow.count;

      // 5. Occupied tables count
      const activeTablesRow = db.prepare("SELECT COUNT(DISTINCT table_number) as count FROM orders WHERE status IN ('new', 'in_kitchen', 'ready')").get();
      const activeTablesCount = activeTablesRow.count;

      // 6. Top selling dishes
      const topDishes = db.prepare(`
        SELECT item_name, SUM(quantity) as units_sold, SUM(item_total) as gross_sales
        FROM order_items
        GROUP BY item_name
        ORDER BY units_sold DESC
        LIMIT 5
      `).all();

      return sendJson(res, 200, {
        success: true,
        metrics: {
          totalRevenue,
          totalOrders,
          aov,
          activeOrdersCount,
          activeTablesCount,
          topDishes
        }
      });
    }

    // --- POST /api/menu (Add new dish) ---
    if (pathname === '/api/menu' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { categoryId, name, description, price, imageUrl, isVeg, isSpicy, isBestseller, portions, addons } = body;

      if (!name || !price || !categoryId) {
        return sendJson(res, 400, { success: false, message: 'Name, price, and categoryId are required' });
      }

      const newId = `dish-${Date.now()}`;
      db.prepare(`
        INSERT INTO products (
          id, category_id, name, description, base_price, image_url,
          is_veg, is_spicy, is_bestseller, is_available, portions, addons
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        newId,
        categoryId,
        name,
        description || '',
        parseFloat(price),
        imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
        isVeg ? 1 : 0,
        isSpicy ? 1 : 0,
        isBestseller ? 1 : 0,
        1,
        JSON.stringify(portions || []),
        JSON.stringify(addons || [])
      );

      return sendJson(res, 201, {
        success: true,
        message: `Dish "${name}" created successfully`,
        dishId: newId
      });
    }

    // --- PUT /api/menu/:id (Update dish) ---
    if (pathname.startsWith('/api/menu/') && method === 'PUT') {
      const dishId = pathname.split('/')[3];
      const body = await parseJsonBody(req);
      const { categoryId, name, description, price, imageUrl, isVeg, isSpicy, isBestseller } = body;

      const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(dishId);
      if (!existing) {
        return sendJson(res, 404, { success: false, message: 'Dish not found' });
      }

      db.prepare(`
        UPDATE products SET
          category_id = COALESCE(?, category_id),
          name = COALESCE(?, name),
          description = COALESCE(?, description),
          base_price = COALESCE(?, base_price),
          image_url = COALESCE(?, image_url),
          is_veg = COALESCE(?, is_veg),
          is_spicy = COALESCE(?, is_spicy),
          is_bestseller = COALESCE(?, is_bestseller)
        WHERE id = ?
      `).run(
        categoryId,
        name,
        description,
        price !== undefined ? parseFloat(price) : null,
        imageUrl,
        isVeg !== undefined ? (isVeg ? 1 : 0) : null,
        isSpicy !== undefined ? (isSpicy ? 1 : 0) : null,
        isBestseller !== undefined ? (isBestseller ? 1 : 0) : null,
        dishId
      );

      return sendJson(res, 200, { success: true, message: `Dish "${dishId}" updated successfully` });
    }

    // --- DELETE /api/menu/:id ---
    if (pathname.startsWith('/api/menu/') && method === 'DELETE') {
      const dishId = pathname.split('/')[3];
      const info = db.prepare('DELETE FROM products WHERE id = ?').run(dishId);
      if (info.changes === 0) {
        return sendJson(res, 404, { success: false, message: 'Dish not found' });
      }
      return sendJson(res, 200, { success: true, message: `Dish "${dishId}" deleted successfully` });
    }

    // --- Short Table URL Redirect (/table/4 -> /?table=4) ---
    if (pathname.startsWith('/table/') && !pathname.startsWith('/api/')) {
      const tableNumber = pathname.split('/')[2];
      res.writeHead(302, { 'Location': `/?table=${tableNumber}` });
      return res.end();
    }

    // ==========================================
    // 2. STATIC FILE SERVER (Frontend)
    // ==========================================
    let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname === '/admin' ? 'admin.html' : pathname);

    // Security check: ensure path stays within project directory
    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('Forbidden');
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        // If requesting /admin routes, serve admin.html
        if (pathname.startsWith('/admin')) {
          filePath = path.join(PUBLIC_DIR, 'admin.html');
        } else {
          filePath = path.join(PUBLIC_DIR, 'index.html');
        }
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (readErr, content) => {
        if (readErr) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          return res.end('Internal Server Error');
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      });
    });

  } catch (error) {
    console.error('[Server Error]', error);
    sendJson(res, 500, { success: false, message: error.message || 'Server error' });
  }
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🍽️  TableBite Server is running on http://localhost:${PORT}`);
  console.log(`📦 Database: SQLite (tablebite.sqlite)`);
  console.log(`🔌 API Endpoints:`);
  console.log(`   - GET   /api/menu              (Fetch categories & dishes)`);
  console.log(`   - GET   /api/tables            (List table numbers & QR tokens)`);
  console.log(`   - POST  /api/orders            (Create customer order)`);
  console.log(`   - GET   /api/orders            (List active orders)`);
  console.log(`   - PATCH /api/orders/:id/status (Advance order state)`);
  console.log(`====================================================`);
});
