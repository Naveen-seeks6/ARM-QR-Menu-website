/**
 * TableBite - Database Management Module
 * Uses Node.js native SQLite engine (node:sqlite) for zero-dependency,
 * high-performance relational storage for products, tables, and orders.
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const DB_PATH = path.join(__dirname, 'tablebite.sqlite');
const db = new DatabaseSync(DB_PATH);

// Enable foreign key constraints and WAL mode for high concurrency
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');

/**
 * Initialize all database tables and indexes
 */
function initDatabase() {
  // 1. Categories Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      display_order INTEGER DEFAULT 0
    );
  `);

  // 2. Products / Menu Items Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      base_price REAL NOT NULL,
      image_url TEXT,
      is_veg INTEGER DEFAULT 1,
      is_spicy INTEGER DEFAULT 0,
      is_bestseller INTEGER DEFAULT 0,
      is_available INTEGER DEFAULT 1,
      portions TEXT DEFAULT '[]',
      addons TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // 3. Tables Registry
  db.exec(`
    CREATE TABLE IF NOT EXISTS tables (
      id TEXT PRIMARY KEY,
      table_number TEXT UNIQUE NOT NULL,
      qr_token TEXT UNIQUE NOT NULL,
      capacity INTEGER DEFAULT 4,
      status TEXT DEFAULT 'vacant',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // 4. Orders Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      table_number TEXT NOT NULL,
      customer_name TEXT,
      customer_phone TEXT,
      status TEXT DEFAULT 'new',
      payment_method TEXT NOT NULL,
      payment_status TEXT DEFAULT 'pending',
      subtotal REAL NOT NULL,
      tax_amount REAL NOT NULL,
      total_amount REAL NOT NULL,
      special_instructions TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // 5. Order Items Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id TEXT,
      item_name TEXT NOT NULL,
      unit_price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      selected_portion TEXT,
      selected_addons TEXT,
      item_total REAL NOT NULL,
      special_note TEXT
    );
  `);

  // 6. Restaurant Settings & Shop Onboarding Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Indexes for fast lookup
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id, is_available);
    CREATE INDEX IF NOT EXISTS idx_tables_number ON tables(table_number);
    CREATE INDEX IF NOT EXISTS idx_tables_token ON tables(qr_token);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_orders_table ON orders(table_number);
    CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
  `);

  // Seed default settings if not populated
  const settingsCount = db.prepare('SELECT count(*) as count FROM settings').get();
  if (settingsCount.count === 0) {
    const defaultSettings = [
      ['restaurant_name', 'ARM Coffee Place'],
      ['tagline', "Let's relax • Kokapet"],
      ['upi_vpa', '7702971510@ybl'],
      ['upi_merchant_name', 'ARM Coffee Place Kokapet'],
      ['tax_percent', '5'],
      ['currency_symbol', '₹'],
      ['contact_phone', '+91 77029 71510'],
      ['wifi_name', 'ARM_Coffee_Guest'],
      ['wifi_pass', 'relax2026']
    ];
    const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    defaultSettings.forEach(([k, v]) => insertSetting.run(k, v));
  }

  console.log('[Database] Schema verified and initialized.');
}

module.exports = {
  db,
  initDatabase
};
