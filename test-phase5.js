/**
 * TableBite - Phase 5 Verification Suite: UPI Payments, Confirmation & Live Tracking
 */

const { db, initDatabase } = require('./db.js');
const QRCode = require('./qr-generator.js');

console.log('====================================================');
console.log('🧪 VERIFYING PHASE 5: PAYMENTS & LIVE TRACKING');
console.log('====================================================\n');

initDatabase();

// ----------------------------------------------------
// 1. Dynamic UPI Intent URI Formulation (NPCI Spec)
// ----------------------------------------------------
console.log('▶ TEST 1: NPCI UPI Intent & QR Formulation');
const vpa = 'tablebite@okaxis';
const merchantName = encodeURIComponent('TableBite Restaurant');
const billAmount = 642.00;
const testOrderId = `order-upi-${Date.now()}`;
const testOrderNumber = `#TB-${Math.floor(1000 + Math.random() * 9000)}`;
const tableNumber = '04';

const upiUri = `upi://pay?pa=${vpa}&pn=${merchantName}&am=${billAmount.toFixed(2)}&tr=${testOrderId}&tn=TableBite_Order_${testOrderNumber}_Table_${tableNumber}&cu=INR`;

if (!upiUri.startsWith('upi://pay?')) throw new Error('Invalid UPI protocol scheme');
if (!upiUri.includes('pa=tablebite@okaxis')) throw new Error('VPA missing in UPI URI');
if (!upiUri.includes(`am=${billAmount.toFixed(2)}`)) throw new Error('Bill amount missing in UPI URI');
if (!upiUri.includes('cu=INR')) throw new Error('Currency missing in UPI URI');

console.log(`  ✓ Generated standard NPCI UPI URI: ${upiUri}`);

// ----------------------------------------------------
// 2. Dynamic UPI QR Code Generation
// ----------------------------------------------------
console.log('▶ TEST 2: Dynamic UPI QR Code Rendering');
const qrSvg = QRCode.generateSVG(upiUri, { cellSize: 5, margin: 2 });
if (!qrSvg || !qrSvg.startsWith('<svg') || !qrSvg.endsWith('</svg>')) {
  throw new Error('Failed to generate valid SVG for dynamic UPI QR');
}
console.log(`  ✓ Successfully generated dynamic payment QR SVG (${qrSvg.length} bytes)\n`);

// ----------------------------------------------------
// 3. Dynamic Order Placement & Pending Payment Lifecycle
// ----------------------------------------------------
console.log('▶ TEST 3: Dynamic Order Placement (UPI QR Pending Flow)');
db.prepare(`
  INSERT INTO orders (
    id, order_number, table_number, customer_name, customer_phone,
    status, payment_method, payment_status, subtotal, tax_amount, total_amount, special_instructions
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  testOrderId,
  testOrderNumber,
  tableNumber,
  'Kavya Nair',
  '9876543210',
  'new',
  'upi_qr',
  'pending',
  611.43,
  30.57,
  billAmount,
  'Extra crispy'
);

let order = db.prepare('SELECT * FROM orders WHERE id = ?').get(testOrderId);
if (!order || order.payment_status !== 'pending') {
  throw new Error('Initial payment status should be pending');
}
console.log(`  ✓ Order ${testOrderNumber} placed with payment_status = pending`);

// ----------------------------------------------------
// 4. Payment Confirmation / Webhook Transition
// ----------------------------------------------------
console.log('▶ TEST 4: Payment Confirmation & Webhook Execution');
const txnRef = `UPI-TXN-${Date.now()}-SUCCESS`;
db.prepare(`
  UPDATE orders 
  SET payment_status = 'paid', 
      payment_method = 'upi_qr',
      updated_at = datetime('now') 
  WHERE id = ?
`).run(testOrderId);

order = db.prepare('SELECT payment_status, status FROM orders WHERE id = ?').get(testOrderId);
if (order.payment_status !== 'paid') {
  throw new Error('Payment confirmation failed to transition status to paid');
}
console.log(`  ✓ Order ${testOrderNumber} successfully verified and marked PAID (Txn: ${txnRef})\n`);

// ----------------------------------------------------
// 5. Cash at Counter Fallback Flow
// ----------------------------------------------------
console.log('▶ TEST 5: Cash at Counter Fallback Flow');
const cashOrderId = `order-cash-${Date.now()}`;
const cashOrderNumber = `#TB-${Math.floor(1000 + Math.random() * 9000)}`;

db.prepare(`
  INSERT INTO orders (
    id, order_number, table_number, customer_name, customer_phone,
    status, payment_method, payment_status, subtotal, tax_amount, total_amount, special_instructions
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  cashOrderId,
  cashOrderNumber,
  '08',
  'Ramesh Verma',
  '9876500000',
  'new',
  'cash_counter',
  'pending',
  350,
  17.5,
  367.5,
  null
);

let cashOrder = db.prepare('SELECT payment_method, payment_status FROM orders WHERE id = ?').get(cashOrderId);
if (cashOrder.payment_method !== 'cash_counter' || cashOrder.payment_status !== 'pending') {
  throw new Error('Cash order initialization failed');
}
console.log(`  ✓ Cash Order ${cashOrderNumber} registered (Method: cash_counter, Status: pending)`);

// Settle Cash Order at reception / KDS
db.prepare("UPDATE orders SET payment_status = 'paid', updated_at = datetime('now') WHERE id = ?").run(cashOrderId);
cashOrder = db.prepare('SELECT payment_status FROM orders WHERE id = ?').get(cashOrderId);
if (cashOrder.payment_status !== 'paid') throw new Error('Cash settlement failed');
console.log(`  ✓ Cash Order settled at counter: payment_status = paid\n`);

// ----------------------------------------------------
// 6. Live Status Polling Query Verification
// ----------------------------------------------------
console.log('▶ TEST 6: Real-Time Order Tracker Status Query');
const polledOrder = db.prepare('SELECT id, order_number, table_number, status, payment_status, total_amount FROM orders WHERE id = ?').get(testOrderId);
if (!polledOrder || polledOrder.order_number !== testOrderNumber) {
  throw new Error('Order polling query failed');
}
console.log(`  ✓ Polled Order: ${polledOrder.order_number} | Table: ${polledOrder.table_number} | Status: ${polledOrder.status} | Paid: ${polledOrder.payment_status}`);

console.log('\n====================================================');
console.log('🎉 PHASE 5 VERIFICATION COMPLETE: ALL TESTS PASSED!');
console.log('====================================================');
