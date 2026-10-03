/**
 * TableBite - Supabase Client & PostgreSQL Data Adapter
 * Provides high-speed REST and Realtime data operations directly to Supabase.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

/**
 * Native REST fetch helper for Supabase PostgREST endpoints
 */
async function supabaseFetch(path, options = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('[Supabase] Missing SUPABASE_URL or SUPABASE_ANON_KEY/SERVICE_ROLE_KEY environment variables.');
  }

  const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1${path}`;
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': options.prefer || 'return=representation',
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`[Supabase Error ${response.status}] ${errorText}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

const supabaseDb = {
  // Menu & Categories
  async getMenu() {
    const categories = await supabaseFetch('/categories?select=*&order=display_order.asc');
    const products = await supabaseFetch('/products?select=*&order=category_id,is_bestseller.desc');
    return { categories, products };
  },

  // Tables
  async getTables() {
    return await supabaseFetch('/tables?select=*&order=table_number.asc');
  },

  async getTableByNumber(tableNumber) {
    const tables = await supabaseFetch(`/tables?table_number=eq.${encodeURIComponent(tableNumber)}&select=*`);
    return tables && tables.length > 0 ? tables[0] : null;
  },

  // Orders
  async createOrder(orderData, itemsData) {
    const [createdOrder] = await supabaseFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });

    const itemsPayload = itemsData.map(item => ({
      ...item,
      order_id: createdOrder.id
    }));

    const createdItems = await supabaseFetch('/order_items', {
      method: 'POST',
      body: JSON.stringify(itemsPayload)
    });

    // Mark table occupied
    await supabaseFetch(`/tables?table_number=eq.${encodeURIComponent(orderData.table_number)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'occupied' })
    });

    return { ...createdOrder, items: createdItems };
  },

  async getOrders() {
    const orders = await supabaseFetch('/orders?select=*,order_items(*)&order=created_at.desc');
    return orders;
  },

  async getOrderById(orderId) {
    const orders = await supabaseFetch(`/orders?or=(id.eq.${encodeURIComponent(orderId)},order_number.eq.${encodeURIComponent(orderId)})&select=*,order_items(*)`);
    return orders && orders.length > 0 ? orders[0] : null;
  },

  async updateOrderStatus(orderId, status) {
    const [updated] = await supabaseFetch(`/orders?or=(id.eq.${encodeURIComponent(orderId)},order_number.eq.${encodeURIComponent(orderId)})`, {
      method: 'PATCH',
      body: JSON.stringify({ status, updated_at: new Date().toISOString() })
    });
    return updated;
  },

  async confirmPayment(orderId, paymentMethod, transactionRef) {
    const [updated] = await supabaseFetch(`/orders?or=(id.eq.${encodeURIComponent(orderId)},order_number.eq.${encodeURIComponent(orderId)})`, {
      method: 'PATCH',
      body: JSON.stringify({
        payment_status: 'paid',
        payment_method: paymentMethod || 'upi_qr',
        updated_at: new Date().toISOString()
      })
    });
    return updated;
  },

  // Settings
  async getSettings() {
    const rows = await supabaseFetch('/settings?select=*');
    const settings = {};
    (rows || []).forEach(r => { settings[r.key] = r.value; });
    return settings;
  },

  async updateSettings(settingsObj) {
    const entries = Object.entries(settingsObj).map(([key, value]) => ({
      key,
      value: String(value)
    }));
    await supabaseFetch('/settings', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates',
      body: JSON.stringify(entries)
    });
    return await this.getSettings();
  }
};

module.exports = {
  supabaseDb,
  supabaseFetch
};
