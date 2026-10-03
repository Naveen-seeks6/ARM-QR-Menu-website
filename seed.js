/**
 * TableBite / ARM Coffee Place - Database Seeder Script
 * Populates products, categories, tables, and settings for ARM Coffee Place (Kokapet).
 */

const { db, initDatabase } = require('./db.js');
const crypto = require('node:crypto');

initDatabase();

console.log('[Seeder] Starting database seed for ARM Coffee Place...');

// 1. Clear existing items and categories
db.prepare('DELETE FROM order_items').run();
db.prepare('DELETE FROM orders').run();
db.prepare('DELETE FROM products').run();
db.prepare('DELETE FROM categories').run();

// 2. Seed Categories
const categories = [
  {
    "id": "hot-beverages",
    "name": "Hot Beverages",
    "icon": "☕",
    "display_order": 1
  },
  {
    "id": "cold-beverages",
    "name": "Cold Drinks & Boba",
    "icon": "🧋",
    "display_order": 2
  },
  {
    "id": "puffs-fries",
    "name": "Puffs & Fries",
    "icon": "🍟",
    "display_order": 3
  },
  {
    "id": "sandwiches-maggi",
    "name": "Sandwiches & Maggi",
    "icon": "🥪",
    "display_order": 4
  },
  {
    "id": "momo-pasta-burgers",
    "name": "Momos, Pasta & Burgers",
    "icon": "🥟",
    "display_order": 5
  },
  {
    "id": "sweet-treats",
    "name": "Sweet Treats",
    "icon": "🍰",
    "display_order": 6
  }
];

const insertCategory = db.prepare(`
  INSERT OR REPLACE INTO categories (id, name, icon, display_order)
  VALUES (?, ?, ?, ?)
`);

categories.forEach(c => {
  insertCategory.run(c.id, c.name, c.icon, c.display_order);
});
console.log(`[Seeder] Seeded ${categories.length} categories.`);

// 3. Seed Products
const products = [
  {
    "id": "arm-hot-101",
    "category_id": "hot-beverages",
    "name": "Filter Coffee",
    "description": "Traditional South Indian filter coffee brewed with chicory-blended decoction and frothy milk.",
    "base_price": 35,
    "image_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-102",
    "category_id": "hot-beverages",
    "name": "Bellam Coffee",
    "description": "Authentic filter coffee sweetened with organic natural country jaggery (Bellam).",
    "base_price": 45,
    "image_url": "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-103",
    "category_id": "hot-beverages",
    "name": "Thati Bellam Coffee",
    "description": "Aromatic artisanal coffee infused with mineral-rich traditional palm jaggery.",
    "base_price": 50,
    "image_url": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-104",
    "category_id": "hot-beverages",
    "name": "Chocolate Coffee",
    "description": "Rich dark cocoa melted into strong hot filter coffee.",
    "base_price": 55,
    "image_url": "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-105",
    "category_id": "hot-beverages",
    "name": "Black Coffee",
    "description": "Pure roasted dark espresso extraction served piping hot without milk.",
    "base_price": 30,
    "image_url": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-106",
    "category_id": "hot-beverages",
    "name": "Black Coffee (Honey)",
    "description": "Smooth black coffee naturally sweetened with pure wild honey.",
    "base_price": 35,
    "image_url": "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-107",
    "category_id": "hot-beverages",
    "name": "Bullet Coffee (A2 Ghee)",
    "description": "Keto-friendly powerhouse energy brew with grass-fed pure A2 desi ghee.",
    "base_price": 65,
    "image_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-201",
    "category_id": "hot-beverages",
    "name": "Regular Tea",
    "description": "Classic Indian kadak milk chai brewed with premium Assam tea leaves.",
    "base_price": 35,
    "image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-202",
    "category_id": "hot-beverages",
    "name": "Small Tea",
    "description": "Quick cutting cup of hot piping milk tea.",
    "base_price": 30,
    "image_url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-203",
    "category_id": "hot-beverages",
    "name": "Bellam Tea",
    "description": "Country jaggery sweetened healthy hot tea.",
    "base_price": 40,
    "image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-204",
    "category_id": "hot-beverages",
    "name": "Thati Bellam Tea",
    "description": "Palm jaggery infused countryside special hot tea.",
    "base_price": 45,
    "image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-205",
    "category_id": "hot-beverages",
    "name": "Ginger Tea",
    "description": "Fresh crushed ginger root (Adrak) simmered in milk chai.",
    "base_price": 40,
    "image_url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-206",
    "category_id": "hot-beverages",
    "name": "Elachi Tea",
    "description": "Fragrant green cardamom pods steeped in rich milk tea.",
    "base_price": 40,
    "image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-207",
    "category_id": "hot-beverages",
    "name": "Green Tea",
    "description": "Pure whole leaf antioxidant green tea infusion.",
    "base_price": 40,
    "image_url": "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-208",
    "category_id": "hot-beverages",
    "name": "Masala Tea",
    "description": "Spiced blend of clove, cinnamon, black pepper, cardamom and ginger.",
    "base_price": 45,
    "image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-209",
    "category_id": "hot-beverages",
    "name": "Pepper Tea",
    "description": "Crushed black pepper spiced throat-soothing tea.",
    "base_price": 45,
    "image_url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-210",
    "category_id": "hot-beverages",
    "name": "Lemon Tea (Honey)",
    "description": "Fresh squeezed lemon and raw forest honey in warm black tea.",
    "base_price": 45,
    "image_url": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-301",
    "category_id": "hot-beverages",
    "name": "Pure Hot Milk",
    "description": "Steamed whole milk.",
    "base_price": 30,
    "image_url": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-302",
    "category_id": "hot-beverages",
    "name": "Golden Milk (Lakadong Turmeric)",
    "description": "High-curcumin Lakadong organic turmeric immunity wellness latte.",
    "base_price": 45,
    "image_url": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-303",
    "category_id": "hot-beverages",
    "name": "Boost",
    "description": "Steamed chocolate malt energy beverage.",
    "base_price": 45,
    "image_url": "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-304",
    "category_id": "hot-beverages",
    "name": "Horlicks",
    "description": "Classic malted cereal hot drink.",
    "base_price": 45,
    "image_url": "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-305",
    "category_id": "hot-beverages",
    "name": "Hot Chocolate",
    "description": "Rich melted cocoa fudge blended with velvety steamed milk.",
    "base_price": 55,
    "image_url": "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[{\"name\":\"Half Cup\",\"price\":55},{\"name\":\"Full Mug\",\"price\":85}]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-306",
    "category_id": "hot-beverages",
    "name": "Badam Milk",
    "description": "Roasted almond and saffron infused hot milk.",
    "base_price": 50,
    "image_url": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-307",
    "category_id": "hot-beverages",
    "name": "Pista Badam Milk",
    "description": "Rich crushed pistachios and almonds in cardamom milk.",
    "base_price": 50,
    "image_url": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-401",
    "category_id": "hot-beverages",
    "name": "Blue / Butterfly Pea Flower Tea",
    "description": "Natural vibrant blue Clitoria ternatea flower antioxidant tea imported from Thailand.",
    "base_price": 65,
    "image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-402",
    "category_id": "hot-beverages",
    "name": "Thai Ginger Tea",
    "description": "Authentic Thai galangal, lemongrass, and kaffir lime soothing herbal tea.",
    "base_price": 65,
    "image_url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-403",
    "category_id": "hot-beverages",
    "name": "5 Teas Herbal Infusion",
    "description": "Five-herb master wellness and lung detox blend specially imported from Thailand.",
    "base_price": 65,
    "image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-404",
    "category_id": "hot-beverages",
    "name": "Carrot Crush (Cold Pressed)",
    "description": "100% pure hydraulic cold-pressed fresh carrots with zero added sugar.",
    "base_price": 99,
    "image_url": "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-405",
    "category_id": "hot-beverages",
    "name": "Heart Beet (Cold Pressed)",
    "description": "Cold-pressed fresh beetroot, organic apple, and ginger root juice.",
    "base_price": 99,
    "image_url": "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-hot-406",
    "category_id": "hot-beverages",
    "name": "ABC Glow Up (Cold Pressed)",
    "description": "Nutrient-dense Apple, Beetroot, and Carrot powerhouse juice for radiant energy.",
    "base_price": 109,
    "image_url": "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-cold-101",
    "category_id": "cold-beverages",
    "name": "Classic Bubble Coffee",
    "description": "Chilled milk-based iced coffee with chewy brown sugar boba pearls.",
    "base_price": 160,
    "image_url": "https://images.unsplash.com/photo-1558857563-b37cf0088924?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[{\"name\":\"Medium (350ml)\",\"price\":160},{\"name\":\"Regular (500ml)\",\"price\":200}]",
    "addons": "[{\"name\":\"Extra Boba Pearls\",\"price\":30}]"
  },
  {
    "id": "arm-cold-102",
    "category_id": "cold-beverages",
    "name": "Cold Coffee",
    "description": "Creamy classic blended iced coffee topped with chocolate drizzle.",
    "base_price": 140,
    "image_url": "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[{\"name\":\"Medium (350ml)\",\"price\":140},{\"name\":\"Regular (500ml)\",\"price\":170}]",
    "addons": "[]"
  },
  {
    "id": "arm-cold-103",
    "category_id": "cold-beverages",
    "name": "Caramel Macchiato Boba",
    "description": "Layered espresso and vanilla milk with caramel drizzle and boba pearls.",
    "base_price": 170,
    "image_url": "https://images.unsplash.com/photo-1558857563-b37cf0088924?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[{\"name\":\"Medium (350ml)\",\"price\":170},{\"name\":\"Regular (500ml)\",\"price\":210}]",
    "addons": "[]"
  },
  {
    "id": "arm-cold-104",
    "category_id": "cold-beverages",
    "name": "Mocha Boba Coffee",
    "description": "Double chocolate espresso iced coffee with chocolate boba pearls.",
    "base_price": 190,
    "image_url": "https://images.unsplash.com/photo-1558857563-b37cf0088924?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[{\"name\":\"Medium (350ml)\",\"price\":190},{\"name\":\"Regular (500ml)\",\"price\":230}]",
    "addons": "[]"
  },
  {
    "id": "arm-cold-201",
    "category_id": "cold-beverages",
    "name": "Classic Bubble Tea",
    "description": "Taiwanese black milk tea infused with sweet tapioca boba pearls.",
    "base_price": 160,
    "image_url": "https://images.unsplash.com/photo-1558857563-b37cf0088924?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[{\"name\":\"Medium (350ml)\",\"price\":160},{\"name\":\"Regular (500ml)\",\"price\":200}]",
    "addons": "[{\"name\":\"Extra Boba Pearls\",\"price\":30}]"
  },
  {
    "id": "arm-cold-202",
    "category_id": "cold-beverages",
    "name": "Oreo Bubble Tea",
    "description": "Crushed Oreo cookie cream milk tea with chewy boba pearls.",
    "base_price": 170,
    "image_url": "https://images.unsplash.com/photo-1558857563-b37cf0088924?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[{\"name\":\"Medium (350ml)\",\"price\":170},{\"name\":\"Regular (500ml)\",\"price\":210}]",
    "addons": "[]"
  },
  {
    "id": "arm-cold-203",
    "category_id": "cold-beverages",
    "name": "Hazelnut Bubble Tea",
    "description": "Roasted hazelnut syrup infused milk tea with tapioca pearls.",
    "base_price": 170,
    "image_url": "https://images.unsplash.com/photo-1558857563-b37cf0088924?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[{\"name\":\"Medium (350ml)\",\"price\":170},{\"name\":\"Regular (500ml)\",\"price\":210}]",
    "addons": "[]"
  },
  {
    "id": "arm-cold-301",
    "category_id": "cold-beverages",
    "name": "Oreo Thickshake",
    "description": "Thick vanilla ice cream blended with double Oreo cookies and fudge.",
    "base_price": 109,
    "image_url": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[{\"name\":\"Extra Crushed Oreo\",\"price\":25},{\"name\":\"Vanilla Ice Cream Scoop\",\"price\":30}]"
  },
  {
    "id": "arm-cold-302",
    "category_id": "cold-beverages",
    "name": "Chocolate Milkshake",
    "description": "Creamy chocolate shake made with Dutch cocoa and whole milk.",
    "base_price": 99,
    "image_url": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-cold-303",
    "category_id": "cold-beverages",
    "name": "Butter Scotch Shake",
    "description": "Golden praline crunch and caramel butterscotch milkshake.",
    "base_price": 109,
    "image_url": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-cold-304",
    "category_id": "cold-beverages",
    "name": "Strawberry Milkshake",
    "description": "Sweet strawberry crush blended with chilled creamy milk.",
    "base_price": 119,
    "image_url": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-cold-401",
    "category_id": "cold-beverages",
    "name": "Blue Curacao Mocktail",
    "description": "Vibrant blue citrus syrup, fresh mint, lime juice, and sparkling soda.",
    "base_price": 129,
    "image_url": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-cold-402",
    "category_id": "cold-beverages",
    "name": "Fresh Lime Mojito",
    "description": "Muddled fresh mint leaves, lime wedges, sugar, and fizzy club soda.",
    "base_price": 79,
    "image_url": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-cold-403",
    "category_id": "cold-beverages",
    "name": "Guava Crush Mojito",
    "description": "Tropical pink guava fruit pulp with a hint of red chili salt rim and soda.",
    "base_price": 99,
    "image_url": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-cold-404",
    "category_id": "cold-beverages",
    "name": "Sweet Punjabi Lassi",
    "description": "Thick churned sweet yogurt topped with malai.",
    "base_price": 59,
    "image_url": "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-cold-405",
    "category_id": "cold-beverages",
    "name": "Fresh Sugar Cane Juice",
    "description": "Fresh crushed organic sugarcane juice with a hint of ginger and lemon.",
    "base_price": 49,
    "image_url": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-snack-101",
    "category_id": "puffs-fries",
    "name": "Veg Puff",
    "description": "Crispy flaky golden pastry stuffed with spiced potato and vegetable masala.",
    "base_price": 25,
    "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-snack-102",
    "category_id": "puffs-fries",
    "name": "Egg Puff",
    "description": "Golden baked flaky puff pastry with boiled egg and pepper onion masala.",
    "base_price": 35,
    "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
    "is_veg": 0,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-snack-103",
    "category_id": "puffs-fries",
    "name": "Chicken Puff",
    "description": "Flaky savory puff stuffed with juicy minced spiced chicken.",
    "base_price": 40,
    "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
    "is_veg": 0,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-snack-104",
    "category_id": "puffs-fries",
    "name": "Jaipuri Samosa (4 pcs)",
    "description": "Crispy Rajasthani cocktail samosas stuffed with spiced potatoes and cashews.",
    "base_price": 69,
    "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-snack-105",
    "category_id": "puffs-fries",
    "name": "Peri Peri French Fries",
    "description": "Crispy golden potato fries tossed in fiery African peri peri spice.",
    "base_price": 119,
    "image_url": "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 1,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[{\"name\":\"Extra Cheese Dip\",\"price\":30}]"
  },
  {
    "id": "arm-snack-106",
    "category_id": "puffs-fries",
    "name": "Salted French Fries",
    "description": "Classic salted crispy potato fries served with tomato ketchup.",
    "base_price": 99,
    "image_url": "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-snack-107",
    "category_id": "puffs-fries",
    "name": "Paneer Sticks (6 pcs)",
    "description": "Crisp panko crumbed cottage cheese sticks with mint garlic dip.",
    "base_price": 99,
    "image_url": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-snack-108",
    "category_id": "puffs-fries",
    "name": "Veg Spring Roll (6 pc)",
    "description": "Crispy rolls filled with shredded cabbage, carrots, and glass noodles.",
    "base_price": 99,
    "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-snack-109",
    "category_id": "puffs-fries",
    "name": "Crispy Fried Chicken",
    "description": "Golden crunchy battered chicken bites with seasoned crust.",
    "base_price": 99,
    "image_url": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80",
    "is_veg": 0,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-snack-110",
    "category_id": "puffs-fries",
    "name": "Chicken Popcorn",
    "description": "Bite-sized tender crispy chicken nuggets with peri peri dip.",
    "base_price": 79,
    "image_url": "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80",
    "is_veg": 0,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-snack-111",
    "category_id": "puffs-fries",
    "name": "Chicken Cheese Balls",
    "description": "Crisp fried chicken meatballs filled with gooey melted cheddar cheese.",
    "base_price": 99,
    "image_url": "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80",
    "is_veg": 0,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-sand-101",
    "category_id": "sandwiches-maggi",
    "name": "Corn Cheese Grill Sandwich",
    "description": "Sweet golden corn and melted mozzarella grilled between buttered bread slices.",
    "base_price": 99,
    "image_url": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[{\"name\":\"Extra Cheese Slice\",\"price\":25}]"
  },
  {
    "id": "arm-sand-102",
    "category_id": "sandwiches-maggi",
    "name": "Avocado Grill Sandwich (Special)",
    "description": "Fresh buttery Hass avocado slices, herbs, tomatoes, and cheese grilled to perfection.",
    "base_price": 129,
    "image_url": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-sand-103",
    "category_id": "sandwiches-maggi",
    "name": "Veg Cheese Grill Sandwich",
    "description": "Classic cucumber, tomato, onion and cheese grilled sandwich with green chutney.",
    "base_price": 79,
    "image_url": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-sand-104",
    "category_id": "sandwiches-maggi",
    "name": "Egg Cheese Grill Sandwich",
    "description": "Fluffy egg omelette and cheese slice grilled inside buttered toast.",
    "base_price": 99,
    "image_url": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
    "is_veg": 0,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-sand-105",
    "category_id": "sandwiches-maggi",
    "name": "Bread Omelette",
    "description": "Street-style spiced double egg omelette wrapped around toasted bread.",
    "base_price": 79,
    "image_url": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80",
    "is_veg": 0,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-maggi-101",
    "category_id": "sandwiches-maggi",
    "name": "Veg Cheese Maggi",
    "description": "Classic 2-minute noodles tossed with butter, sauteed veggies, and melted cheddar.",
    "base_price": 79,
    "image_url": "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[{\"name\":\"Extra Cheese Layer\",\"price\":25}]"
  },
  {
    "id": "arm-maggi-102",
    "category_id": "sandwiches-maggi",
    "name": "Corn Cheese Maggi",
    "description": "Cheesy noodles packed with sweet corn kernels and aromatic masala.",
    "base_price": 89,
    "image_url": "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-maggi-103",
    "category_id": "sandwiches-maggi",
    "name": "Egg Cheese Maggi",
    "description": "Scrambled egg and melted cheese tossed in spiced Maggi noodles.",
    "base_price": 89,
    "image_url": "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80",
    "is_veg": 0,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-maggi-104",
    "category_id": "sandwiches-maggi",
    "name": "Soupy Maggi",
    "description": "Warm comfort bowl of broth-style piping hot Maggi noodles.",
    "base_price": 59,
    "image_url": "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-momo-101",
    "category_id": "momo-pasta-burgers",
    "name": "Paneer Momos (6 Pcs)",
    "description": "Steamed Himalayan dumplings stuffed with spiced cottage cheese and herbs.",
    "base_price": 99,
    "image_url": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[{\"name\":\"Extra Spicy Red Chili Dip\",\"price\":20},{\"name\":\"Creamy Mayo Dip\",\"price\":20}]"
  },
  {
    "id": "arm-momo-102",
    "category_id": "momo-pasta-burgers",
    "name": "Paneer Fried Momos (6 Pcs)",
    "description": "Crisp deep-fried golden paneer momos served with fiery schezwan sauce.",
    "base_price": 109,
    "image_url": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 1,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-momo-103",
    "category_id": "momo-pasta-burgers",
    "name": "Veg Momos (6 Pcs)",
    "description": "Steamed vegetable dumplings packed with finely minced cabbage and carrots.",
    "base_price": 89,
    "image_url": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-momo-104",
    "category_id": "momo-pasta-burgers",
    "name": "Chicken Momos (6 pcs)",
    "description": "Juicy steamed dumplings filled with spiced minced chicken and spring onions.",
    "base_price": 119,
    "image_url": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80",
    "is_veg": 0,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-momo-105",
    "category_id": "momo-pasta-burgers",
    "name": "Chicken Fried Momos (6 Pcs)",
    "description": "Crunchy fried chicken dumplings tossed with pepper seasoning.",
    "base_price": 129,
    "image_url": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80",
    "is_veg": 0,
    "is_spicy": 1,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-pasta-101",
    "category_id": "momo-pasta-burgers",
    "name": "Cheese Macaroni",
    "description": "Tender elbow macaroni smothered in rich velvety cheddar cheese sauce.",
    "base_price": 99,
    "image_url": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-pasta-102",
    "category_id": "momo-pasta-burgers",
    "name": "Masala Penne Pasta",
    "description": "Indian street-style spiced tomato penne pasta with veggies.",
    "base_price": 99,
    "image_url": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 1,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-pasta-103",
    "category_id": "momo-pasta-burgers",
    "name": "Mushroom Penne Pasta",
    "description": "Button mushrooms sauteed in creamy white garlic herb sauce.",
    "base_price": 99,
    "image_url": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-burger-101",
    "category_id": "momo-pasta-burgers",
    "name": "Chicken Burger",
    "description": "Crispy chicken patty with lettuce, cheese, and garlic mayo in a toasted sesame bun.",
    "base_price": 129,
    "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    "is_veg": 0,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-burger-102",
    "category_id": "momo-pasta-burgers",
    "name": "Veg Burger",
    "description": "Crisp vegetable patty with tomato, onion, lettuce and creamy burger mayo.",
    "base_price": 99,
    "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-pizza-101",
    "category_id": "momo-pasta-burgers",
    "name": "Corn Cheese Pizza",
    "description": "Thin crust pizza loaded with sweet corn and melted mozzarella cheese.",
    "base_price": 119,
    "image_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-pizza-102",
    "category_id": "momo-pasta-burgers",
    "name": "Veg Cheese Pizza",
    "description": "Capsicum, onion, tomato, and mozzarella pizza with oregano herb seasoning.",
    "base_price": 119,
    "image_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-sweet-101",
    "category_id": "sweet-treats",
    "name": "Brownie with Icecream",
    "description": "Warm fudgy chocolate brownie topped with a scoop of vanilla bean ice cream and chocolate syrup.",
    "base_price": 79,
    "image_url": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[{\"name\":\"Extra Vanilla Ice Cream\",\"price\":30}]"
  },
  {
    "id": "arm-sweet-102",
    "category_id": "sweet-treats",
    "name": "Warm Chocolate Brownie",
    "description": "Classic rich cocoa brownie with gooey chocolate center.",
    "base_price": 59,
    "image_url": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-sweet-103",
    "category_id": "sweet-treats",
    "name": "Chocolate Pastry",
    "description": "Decadent dark chocolate sponge layered with Dutch chocolate mousse.",
    "base_price": 69,
    "image_url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-sweet-104",
    "category_id": "sweet-treats",
    "name": "Butterscotch Pastry",
    "description": "Vanilla sponge with butterscotch cream and crunchy caramel praline.",
    "base_price": 59,
    "image_url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 0,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  },
  {
    "id": "arm-sweet-105",
    "category_id": "sweet-treats",
    "name": "Irani Maska Bun",
    "description": "Soft sweet bakery bun lavishly spread with Amul butter and fruit jam.",
    "base_price": 69,
    "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    "is_veg": 1,
    "is_spicy": 0,
    "is_bestseller": 1,
    "is_available": 1,
    "portions": "[]",
    "addons": "[]"
  }
];

const insertProduct = db.prepare(`
  INSERT OR REPLACE INTO products (
    id, category_id, name, description, base_price,
    image_url, is_veg, is_spicy, is_bestseller, is_available,
    portions, addons
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

products.forEach(p => {
  insertProduct.run(
    p.id,
    p.category_id,
    p.name,
    p.description,
    p.base_price,
    p.image_url,
    p.is_veg,
    p.is_spicy,
    p.is_bestseller,
    p.is_available,
    p.portions,
    p.addons
  );
});
console.log(`[Seeder] Seeded ${products.length} products.`);

// 4. Seed Tables with cryptographic QR tokens
const tablesData = [
  { number: '1', capacity: 2 },
  { number: '2', capacity: 2 },
  { number: '3', capacity: 4 },
  { number: '4', capacity: 4 },
  { number: '5', capacity: 6 },
  { number: '6', capacity: 4 },
  { number: '7', capacity: 2 },
  { number: '8', capacity: 8 }
];

const insertTable = db.prepare(`
  INSERT OR REPLACE INTO tables (id, table_number, qr_token, capacity, status)
  VALUES (?, ?, ?, ?, ?)
`);

tablesData.forEach(t => {
  const token = crypto.createHash('sha256').update(`arm-coffee-table-${t.number}-secret-key-2026`).digest('hex').substring(0, 16);
  insertTable.run(`tbl-${t.number}`, t.number, token, t.capacity, 'vacant');
});
console.log(`[Seeder] Seeded ${tablesData.length} dining tables.`);

// 5. Seed Restaurant Settings (ARM Coffee Place)
const settings = [
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

const insertSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
settings.forEach(([k, v]) => insertSetting.run(k, v));
console.log('[Seeder] Seeded ARM Coffee Place settings with UPI: 7702971510@ybl');

// 6. Seed a sample order for Table 2
const sampleOrderId = `order-${Date.now()}`;
db.prepare(`
  INSERT OR REPLACE INTO orders (
    id, order_number, table_number, customer_name, customer_phone,
    status, payment_method, payment_status, subtotal, tax_amount, total_amount, special_instructions
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  sampleOrderId,
  '#ARM-101',
  '2',
  'Kavya Reddy',
  '9876543210',
  'in_kitchen',
  'upi_intent',
  'paid',
  235.00,
  11.75,
  246.75,
  'Extra hot coffee please'
);

db.prepare(`
  INSERT OR REPLACE INTO order_items (
    id, order_id, product_id, item_name, unit_price, quantity, selected_portion, selected_addons, item_total, special_note
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  `item-${Date.now()}-1`,
  sampleOrderId,
  'arm-hot-101',
  'Filter Coffee',
  35.00,
  2,
  null,
  '[]',
  70.00,
  'Strong & Hot'
);

db.prepare(`
  INSERT OR REPLACE INTO order_items (
    id, order_id, product_id, item_name, unit_price, quantity, selected_portion, selected_addons, item_total, special_note
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  `item-${Date.now()}-2`,
  sampleOrderId,
  'arm-snack-305',
  'Peri Peri Fries',
  95.00,
  1,
  null,
  '[]',
  95.00,
  'Extra crispy'
);

db.prepare(`
  INSERT OR REPLACE INTO order_items (
    id, order_id, product_id, item_name, unit_price, quantity, selected_portion, selected_addons, item_total, special_note
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  `item-${Date.now()}-3`,
  sampleOrderId,
  'arm-hot-119',
  'Hot Chocolate',
  70.00,
  1,
  'Full',
  '[]',
  70.00,
  null
);

console.log('[Seeder] Seeded sample active order #ARM-101 for Table 2.');
console.log('[Seeder] ARM Coffee Place database seeding completed successfully!');
