-- ============================================================================
-- TableBite - Supabase PostgreSQL Schema & Realtime Configuration
-- Run this SQL in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  display_order INT DEFAULT 0
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  base_price NUMERIC NOT NULL,
  image_url TEXT,
  is_veg BOOLEAN DEFAULT TRUE,
  is_spicy BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  portions JSONB DEFAULT '[]'::jsonb,
  addons JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tables Table
CREATE TABLE IF NOT EXISTS tables (
  id TEXT PRIMARY KEY,
  table_number TEXT UNIQUE NOT NULL,
  qr_token TEXT UNIQUE NOT NULL,
  capacity INT DEFAULT 4,
  status TEXT DEFAULT 'vacant', -- 'vacant' or 'occupied'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT ('order-' || extract(epoch from now())::bigint || '-' || substring(md5(random()::text) from 1 for 6)),
  order_number TEXT UNIQUE NOT NULL,
  table_number TEXT NOT NULL,
  customer_name TEXT DEFAULT 'Diner',
  customer_phone TEXT,
  status TEXT DEFAULT 'new', -- 'new', 'in_kitchen', 'ready', 'served', 'completed', 'cancelled'
  payment_method TEXT NOT NULL DEFAULT 'upi_qr', -- 'upi_qr', 'upi_intent', 'cash_counter'
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid'
  subtotal NUMERIC NOT NULL,
  tax_amount NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY DEFAULT ('oi-' || extract(epoch from now())::bigint || '-' || substring(md5(random()::text) from 1 for 6)),
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT,
  item_name TEXT NOT NULL,
  unit_price NUMERIC NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  selected_portion TEXT,
  selected_addons JSONB DEFAULT '[]'::jsonb,
  item_total NUMERIC NOT NULL,
  special_note TEXT
);

-- 7. Restaurant Settings Table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_cat ON products(category_id, is_available);
CREATE INDEX IF NOT EXISTS idx_tables_num ON tables(table_number);
CREATE INDEX IF NOT EXISTS idx_orders_stat ON orders(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_tbl ON orders(table_number);
CREATE INDEX IF NOT EXISTS idx_order_items_ord ON order_items(order_id);

-- ============================================================================
-- 8. Row Level Security (RLS) Policies
-- ============================================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public Anonymous Read Policies (Diners can view menu and tables)
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can view tables" ON tables FOR SELECT USING (true);
CREATE POLICY "Public can view settings" ON settings FOR SELECT USING (true);

-- Public Order Placement
CREATE POLICY "Public can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public can update order payment" ON orders FOR UPDATE USING (true);

CREATE POLICY "Public can create order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view order items" ON order_items FOR SELECT USING (true);

-- Authenticated Admin Full Access
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access tables" ON tables FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access order_items" ON order_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- 9. Enable Realtime Push (Live KDS & Diner Tracking without polling!)
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- ============================================================================
-- 10. Default Settings Seed
-- ============================================================================
INSERT INTO settings (key, value) VALUES
  ('restaurant_name', 'TableBite Artisanal Diner'),
  ('tagline', 'Artisanal Dine-in • Contactless Experience'),
  ('upi_vpa', 'tablebite@okaxis'),
  ('upi_merchant_name', 'TableBite Restaurant'),
  ('tax_percent', '5'),
  ('currency_symbol', '₹'),
  ('contact_phone', '+91 98765 43210'),
  ('wifi_name', 'TableBite_Guest'),
  ('wifi_pass', 'tastybite2026')
ON CONFLICT (key) DO NOTHING;
