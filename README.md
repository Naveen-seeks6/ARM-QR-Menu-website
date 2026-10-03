# TableBite &bull; Contactless QR Dine-in Menu &amp; Ordering System

TableBite is a high-performance, mobile-first QR-based table ordering, UPI payment, and kitchen management application built for modern restaurants.

---

## 🚀 Phase 1: Customer Mobile UI (Completed)

In Phase 1, we implemented the complete diner-facing interface:
- **📱 Mobile Sticky Navigation**:
  - Branded header with active table pill (e.g. `📍 Table 04`) with interactive table switcher modal.
  - Real-time search filter for dishes and ingredients.
  - Dietary filter pills (*Pure Veg* green badge, *Non-Veg* red badge) with instant re-filtering.
- **📑 Categories Bar**:
  - Smooth horizontal scrolling pill bar (*All Dishes*, *Starters*, *Main Course*, *Breads & Rice*, *Drinks*, *Desserts*).
  - One-tap smooth scrolling directly to each menu section.
- **🍲 Appetizing Product Cards**:
  - Visual dish cards featuring high-res food photography, dietary markers, spicy indicators, and bestseller badges.
  - Morphing `+ ADD` action button that transforms into an interactive `[-] qty [+]` stepper once added.
- **⚙️ Item Customization Drawer**:
  - Slide-up bottom sheet for dishes with customizable portion sizes (Regular / Large) and optional add-ons (Extra cheese, dipping sauces).
  - Special cooking instruction notes textarea (*"Less spicy", "No onions"*).
  - Dynamic price recalculation in the sticky drawer footer.
- **🛒 Floating Cart Bar & Slide-up Cart**:
  - Animated floating bottom pill showing total item count and grand total (`3 Items • ₹640 | View Cart →`).
  - Slide-up cart review sheet with quantity adjusters, item deletion, and full GST bill breakdown.
- **💳 Frictionless Checkout**:
  - Diner Name and Phone Number inputs for digital receipt generation.
  - Payment method selector: Direct UPI Intent, Dynamic UPI QR, and Cash at Counter.
- **🎉 Live Order Status Tracker**:
  - Celebratory confetti explosion on order placement.
  - Unique readable Order Code (e.g. `#TB-1049`).
  - Simulated real-time kitchen progress timeline (`Order Sent` &rarr; `Cooking` &rarr; `Ready to Serve` &rarr; `Served`).

---

## 📁 File Structure

```
qr-menu-app/
├── index.html       # Mobile-first semantic HTML5 interface & accessible drawers
├── styles.css       # Saffron Amber responsive design system & animations
├── menu-data.js     # Master menu catalog (20+ dishes, categories, portions, add-ons)
├── app.js           # Client controller (cart, filters, customization, checkout, tracker)
├── README.md        # Project guide & preview instructions
├── docs/            # The 6 Foundation Documents (Vibe Coding Framework)
│   ├── 01-prd.md
│   ├── 02-trd.md
│   ├── 03-app-flow.md
│   ├── 04-ui-ux-design-brief.md
│   ├── 05-backend-schema.md
│   └── 06-implementation-plan.md
└── .agents/         # Vibe Coding Docs Antigravity Skill
```

---

## 🖥️ How to Run & Preview

Run a lightweight HTTP server inside the project directory:

```bash
cd /Users/naveenkumar/.gemini/antigravity/scratch/qr-menu-app
python3 -m http.server 3000
```

Then open **[http://localhost:3000](http://localhost:3000)** in your browser or phone.

### Testing Table Binding:
- Visit **[http://localhost:3000/?table=7](http://localhost:3000/?table=7)** to simulate scanning the QR code on **Table 7**.
- You can also click the table badge at the top right of the screen anytime to switch tables on the fly.
