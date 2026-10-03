/**
 * Direct SQLite Database & Business Logic Verification for Phase 2
 */

const { db, initDatabase } = require('./db.js');

console.log('🧪 Testing SQLite Database directly...');

initDatabase();

// 1. Verify Categories
const categories = db.prepare('SELECT * FROM categories ORDER BY display_order ASC').all();
console.log(`[DB Test 1] Categories: ${categories.length} found`);
if (categories.length !== 5) throw new Error('Categories count mismatch');

// 2. Verify Products
const products = db.prepare('SELECT * FROM products').all();
console.log(`[DB Test 2] Products: ${products.length} items found`);
if (products.length < 15) throw new Error('Products count mismatch');

// 3. Verify Tables
const tables = db.prepare('SELECT * FROM tables ORDER BY CAST(table_number AS INT) ASC').all();
console.log(`[DB Test 3] Tables: ${tables.length} physical tables with cryptographic QR tokens`);
if (tables.length !== 16) throw new Error('Tables count mismatch');
console.log(`[DB Test 3 Sample] Table 4 token: ${tables[3].qr_token}`);

// 4. Test Order Creation Transaction
const testOrderId = `order-test-${Date.now()}`;
const testOrderNumber = `#TB-9999`;
const subtotal = 520.00;
const tax = 26.00;
const total = 546.00;

db.prepare(`
  INSERT INTO orders (
    id, order_number, table_number, customer_name, customer_phone,
    status, payment_method, payment_status, subtotal, tax_amount, total_amount, special_instructions
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  testOrderId,
  testOrderNumber,
  '4',
  'Sneha Rao',
  '9876543210',
  'new',
  'upi_intent',
  'paid',
  subtotal,
  tax,
  total,
  'Hot food please'
);

db.prepare(`
  INSERT INTO order_items (
    id, order_id, product_id, item_name, unit_price, quantity, selected_portion, selected_addons, item_total, special_note
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  `item-test-1`,
  testOrderId,
  'dish-101',
  'Paneer Tikka Angara',
  280.00,
  1,
  'Regular (6 Pcs)',
  '[]',
  280.00,
  null
);

db.prepare(`
  INSERT INTO order_items (
    id, order_id, product_id, item_name, unit_price, quantity, selected_portion, selected_addons, item_total, special_note
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  `item-test-2`,
  testOrderId,
  'dish-102',
  'Crispy Corn & Water Chestnut',
  240.00,
  1,
  null,
  '[]',
  240.00,
  null
);

console.log(`[DB Test 4] Created Order ${testOrderNumber} for Table 4 with 2 line items.`);

// 5. Query Order back with line items
const retrievedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(testOrderId);
const retrievedItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(testOrderId);
console.log(`[DB Test 5] Retrieved Order: ${retrievedOrder.order_number}, Customer: ${retrievedOrder.customer_name}, Total: ₹${retrievedOrder.total_amount}`);
console.log(`[DB Test 5] Items attached: ${retrievedItems.map(i => i.item_name).join(' + ')}`);
if (retrievedItems.length !== 2) throw new Error('Order items count mismatch');

// 6. Test Status Transition
db.prepare("UPDATE orders SET status = 'in_kitchen', updated_at = datetime('now') WHERE id = ?").run(testOrderId);
const updatedOrder = db.prepare('SELECT status FROM orders WHERE id = ?').get(testOrderId);
console.log(`[DB Test 6] Status successfully updated to: ${updatedOrder.status}`);
if (updatedOrder.status !== 'in_kitchen') throw new Error('Status update mismatch');

// 7. Test 86 Out-of-Stock Toggle
db.prepare("UPDATE products SET is_available = 0 WHERE id = 'dish-101'").run();
const toggledDish = db.prepare("SELECT is_available FROM products WHERE id = 'dish-101'").get();
console.log(`[DB Test 7] dish-101 availability toggled to: ${toggledDish.is_available === 0 ? 'Out of Stock' : 'In Stock'}`);
// Revert back
db.prepare("UPDATE products SET is_available = 1 WHERE id = 'dish-101'").run();

console.log('✅ ALL SQLITE DATABASE & BACKEND INTEGRITY TESTS PASSED!');
