/**
 * ARM Coffee Place (Kokapet) - Master Menu Catalog Data
 * Authentic menu with hot/cold beverages, boba, shakes, fries, sandwiches, maggi, momos, pasta, burgers & sweet treats.
 */

const CATEGORIES = [
  { id: "all", name: "All Items", icon: "✨" },
  { id: "hot-beverages", name: "Hot Beverages", icon: "☕" },
  { id: "cold-beverages", name: "Cold Drinks & Boba", icon: "🧋" },
  { id: "puffs-fries", name: "Puffs & Fries", icon: "🍟" },
  { id: "sandwiches-maggi", name: "Sandwiches & Maggi", icon: "🥪" },
  { id: "momo-pasta-burgers", name: "Momos, Pasta & Burgers", icon: "🥟" },
  { id: "sweet-treats", name: "Sweet Treats", icon: "🍰" }
];

const MENU_DATA = [
  // ==========================================
  // 1. HOT BEVERAGES (Coffee, Tea, Milk, Herbal, Cold Pressed)
  // ==========================================
  // Coffee
  {
    id: "arm-hot-101",
    categoryId: "hot-beverages",
    name: "Filter Coffee",
    description: "Traditional South Indian filter coffee brewed with chicory-blended decoction and frothy milk.",
    price: 35,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-102",
    categoryId: "hot-beverages",
    name: "Bellam Coffee",
    description: "Authentic filter coffee sweetened with organic natural country jaggery (Bellam).",
    price: 45,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-103",
    categoryId: "hot-beverages",
    name: "Thati Bellam Coffee",
    description: "Aromatic artisanal coffee infused with mineral-rich traditional palm jaggery.",
    price: 50,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-104",
    categoryId: "hot-beverages",
    name: "Chocolate Coffee",
    description: "Rich dark cocoa melted into strong hot filter coffee.",
    price: 55,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-105",
    categoryId: "hot-beverages",
    name: "Black Coffee",
    description: "Pure roasted dark espresso extraction served piping hot without milk.",
    price: 30,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-106",
    categoryId: "hot-beverages",
    name: "Black Coffee (Honey)",
    description: "Smooth black coffee naturally sweetened with pure wild honey.",
    price: 35,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-107",
    categoryId: "hot-beverages",
    name: "Bullet Coffee (A2 Ghee)",
    description: "Keto-friendly powerhouse energy brew with grass-fed pure A2 desi ghee.",
    price: 65,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },

  // Tea
  {
    id: "arm-hot-201",
    categoryId: "hot-beverages",
    name: "Regular Tea",
    description: "Classic Indian kadak milk chai brewed with premium Assam tea leaves.",
    price: 35,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-202",
    categoryId: "hot-beverages",
    name: "Small Tea",
    description: "Quick cutting cup of hot piping milk tea.",
    price: 30,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-203",
    categoryId: "hot-beverages",
    name: "Bellam Tea",
    description: "Country jaggery sweetened healthy hot tea.",
    price: 40,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-204",
    categoryId: "hot-beverages",
    name: "Thati Bellam Tea",
    description: "Palm jaggery infused countryside special hot tea.",
    price: 45,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-205",
    categoryId: "hot-beverages",
    name: "Ginger Tea",
    description: "Fresh crushed ginger root (Adrak) simmered in milk chai.",
    price: 40,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-206",
    categoryId: "hot-beverages",
    name: "Elachi Tea",
    description: "Fragrant green cardamom pods steeped in rich milk tea.",
    price: 40,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-207",
    categoryId: "hot-beverages",
    name: "Green Tea",
    description: "Pure whole leaf antioxidant green tea infusion.",
    price: 40,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-208",
    categoryId: "hot-beverages",
    name: "Masala Tea",
    description: "Spiced blend of clove, cinnamon, black pepper, cardamom and ginger.",
    price: 45,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-209",
    categoryId: "hot-beverages",
    name: "Pepper Tea",
    description: "Crushed black pepper spiced throat-soothing tea.",
    price: 45,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-210",
    categoryId: "hot-beverages",
    name: "Lemon Tea (Honey)",
    description: "Fresh squeezed lemon and raw forest honey in warm black tea.",
    price: 45,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },

  // Milk & Specialty
  {
    id: "arm-hot-301",
    categoryId: "hot-beverages",
    name: "Pure Hot Milk",
    description: "Steamed whole milk.",
    price: 30,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-302",
    categoryId: "hot-beverages",
    name: "Golden Milk (Lakadong Turmeric)",
    description: "High-curcumin Lakadong organic turmeric immunity wellness latte.",
    price: 45,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-303",
    categoryId: "hot-beverages",
    name: "Boost",
    description: "Steamed chocolate malt energy beverage.",
    price: 45,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-304",
    categoryId: "hot-beverages",
    name: "Horlicks",
    description: "Classic malted cereal hot drink.",
    price: 45,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-305",
    categoryId: "hot-beverages",
    name: "Hot Chocolate",
    description: "Rich melted cocoa fudge blended with velvety steamed milk.",
    price: 55,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop&q=80",
    portions: [
      { name: "Half Cup", price: 55 },
      { name: "Full Mug", price: 85 }
    ],
    addons: []
  },
  {
    id: "arm-hot-306",
    categoryId: "hot-beverages",
    name: "Badam Milk",
    description: "Roasted almond and saffron infused hot milk.",
    price: 50,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-307",
    categoryId: "hot-beverages",
    name: "Pista Badam Milk",
    description: "Rich crushed pistachios and almonds in cardamom milk.",
    price: 50,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },

  // Herbal Teas & Cold Pressed
  {
    id: "arm-hot-401",
    categoryId: "hot-beverages",
    name: "Blue / Butterfly Pea Flower Tea",
    description: "Natural vibrant blue Clitoria ternatea flower antioxidant tea imported from Thailand.",
    price: 65,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-402",
    categoryId: "hot-beverages",
    name: "Thai Ginger Tea",
    description: "Authentic Thai galangal, lemongrass, and kaffir lime soothing herbal tea.",
    price: 65,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-403",
    categoryId: "hot-beverages",
    name: "5 Teas Herbal Infusion",
    description: "Five-herb master wellness and lung detox blend specially imported from Thailand.",
    price: 65,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-404",
    categoryId: "hot-beverages",
    name: "Carrot Crush (Cold Pressed)",
    description: "100% pure hydraulic cold-pressed fresh carrots with zero added sugar.",
    price: 99,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-405",
    categoryId: "hot-beverages",
    name: "Heart Beet (Cold Pressed)",
    description: "Cold-pressed fresh beetroot, organic apple, and ginger root juice.",
    price: 99,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-hot-406",
    categoryId: "hot-beverages",
    name: "ABC Glow Up (Cold Pressed)",
    description: "Nutrient-dense Apple, Beetroot, and Carrot powerhouse juice for radiant energy.",
    price: 109,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },

  // ==========================================
  // 2. COLD BEVERAGES (Boba Coffee, Boba Tea, Shakes, Mojitos, Coolers)
  // ==========================================
  // Boba Coffee
  {
    id: "arm-cold-101",
    categoryId: "cold-beverages",
    name: "Classic Bubble Coffee",
    description: "Chilled milk-based iced coffee with chewy brown sugar boba pearls.",
    price: 160,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1558857563-b37cf0088924?w=600&auto=format&fit=crop&q=80",
    portions: [
      { name: "Medium (350ml)", price: 160 },
      { name: "Regular (500ml)", price: 200 }
    ],
    addons: [
      { name: "Extra Boba Pearls", price: 30 }
    ]
  },
  {
    id: "arm-cold-102",
    categoryId: "cold-beverages",
    name: "Cold Coffee",
    description: "Creamy classic blended iced coffee topped with chocolate drizzle.",
    price: 140,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80",
    portions: [
      { name: "Medium (350ml)", price: 140 },
      { name: "Regular (500ml)", price: 170 }
    ],
    addons: []
  },
  {
    id: "arm-cold-103",
    categoryId: "cold-beverages",
    name: "Caramel Macchiato Boba",
    description: "Layered espresso and vanilla milk with caramel drizzle and boba pearls.",
    price: 170,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1558857563-b37cf0088924?w=600&auto=format&fit=crop&q=80",
    portions: [
      { name: "Medium (350ml)", price: 170 },
      { name: "Regular (500ml)", price: 210 }
    ],
    addons: []
  },
  {
    id: "arm-cold-104",
    categoryId: "cold-beverages",
    name: "Mocha Boba Coffee",
    description: "Double chocolate espresso iced coffee with chocolate boba pearls.",
    price: 190,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1558857563-b37cf0088924?w=600&auto=format&fit=crop&q=80",
    portions: [
      { name: "Medium (350ml)", price: 190 },
      { name: "Regular (500ml)", price: 230 }
    ],
    addons: []
  },

  // Boba Tea
  {
    id: "arm-cold-201",
    categoryId: "cold-beverages",
    name: "Classic Bubble Tea",
    description: "Taiwanese black milk tea infused with sweet tapioca boba pearls.",
    price: 160,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1558857563-b37cf0088924?w=600&auto=format&fit=crop&q=80",
    portions: [
      { name: "Medium (350ml)", price: 160 },
      { name: "Regular (500ml)", price: 200 }
    ],
    addons: [
      { name: "Extra Boba Pearls", price: 30 }
    ]
  },
  {
    id: "arm-cold-202",
    categoryId: "cold-beverages",
    name: "Oreo Bubble Tea",
    description: "Crushed Oreo cookie cream milk tea with chewy boba pearls.",
    price: 170,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1558857563-b37cf0088924?w=600&auto=format&fit=crop&q=80",
    portions: [
      { name: "Medium (350ml)", price: 170 },
      { name: "Regular (500ml)", price: 210 }
    ],
    addons: []
  },
  {
    id: "arm-cold-203",
    categoryId: "cold-beverages",
    name: "Hazelnut Bubble Tea",
    description: "Roasted hazelnut syrup infused milk tea with tapioca pearls.",
    price: 170,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1558857563-b37cf0088924?w=600&auto=format&fit=crop&q=80",
    portions: [
      { name: "Medium (350ml)", price: 170 },
      { name: "Regular (500ml)", price: 210 }
    ],
    addons: []
  },

  // Milkshakes
  {
    id: "arm-cold-301",
    categoryId: "cold-beverages",
    name: "Oreo Thickshake",
    description: "Thick vanilla ice cream blended with double Oreo cookies and fudge.",
    price: 109,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: [
      { name: "Extra Crushed Oreo", price: 25 },
      { name: "Vanilla Ice Cream Scoop", price: 30 }
    ]
  },
  {
    id: "arm-cold-302",
    categoryId: "cold-beverages",
    name: "Chocolate Milkshake",
    description: "Creamy chocolate shake made with Dutch cocoa and whole milk.",
    price: 99,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-cold-303",
    categoryId: "cold-beverages",
    name: "Butter Scotch Shake",
    description: "Golden praline crunch and caramel butterscotch milkshake.",
    price: 109,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-cold-304",
    categoryId: "cold-beverages",
    name: "Strawberry Milkshake",
    description: "Sweet strawberry crush blended with chilled creamy milk.",
    price: 119,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },

  // Mojitos & Coolers
  {
    id: "arm-cold-401",
    categoryId: "cold-beverages",
    name: "Blue Curacao Mocktail",
    description: "Vibrant blue citrus syrup, fresh mint, lime juice, and sparkling soda.",
    price: 129,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-cold-402",
    categoryId: "cold-beverages",
    name: "Fresh Lime Mojito",
    description: "Muddled fresh mint leaves, lime wedges, sugar, and fizzy club soda.",
    price: 79,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-cold-403",
    categoryId: "cold-beverages",
    name: "Guava Crush Mojito",
    description: "Tropical pink guava fruit pulp with a hint of red chili salt rim and soda.",
    price: 99,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-cold-404",
    categoryId: "cold-beverages",
    name: "Sweet Punjabi Lassi",
    description: "Thick churned sweet yogurt topped with malai.",
    price: 59,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-cold-405",
    categoryId: "cold-beverages",
    name: "Fresh Sugar Cane Juice",
    description: "Fresh crushed organic sugarcane juice with a hint of ginger and lemon.",
    price: 49,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },

  // ==========================================
  // 3. PUFFS & FRIES (Puffs, Fries, Nuggets, Bites)
  // ==========================================
  {
    id: "arm-snack-101",
    categoryId: "puffs-fries",
    name: "Veg Puff",
    description: "Crispy flaky golden pastry stuffed with spiced potato and vegetable masala.",
    price: 25,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-snack-102",
    categoryId: "puffs-fries",
    name: "Egg Puff",
    description: "Golden baked flaky puff pastry with boiled egg and pepper onion masala.",
    price: 35,
    isVeg: false,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-snack-103",
    categoryId: "puffs-fries",
    name: "Chicken Puff",
    description: "Flaky savory puff stuffed with juicy minced spiced chicken.",
    price: 40,
    isVeg: false,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-snack-104",
    categoryId: "puffs-fries",
    name: "Jaipuri Samosa (4 pcs)",
    description: "Crispy Rajasthani cocktail samosas stuffed with spiced potatoes and cashews.",
    price: 69,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-snack-105",
    categoryId: "puffs-fries",
    name: "Peri Peri French Fries",
    description: "Crispy golden potato fries tossed in fiery African peri peri spice.",
    price: 119,
    isVeg: true,
    isSpicy: true,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: [
      { name: "Extra Cheese Dip", price: 30 }
    ]
  },
  {
    id: "arm-snack-106",
    categoryId: "puffs-fries",
    name: "Salted French Fries",
    description: "Classic salted crispy potato fries served with tomato ketchup.",
    price: 99,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-snack-107",
    categoryId: "puffs-fries",
    name: "Paneer Sticks (6 pcs)",
    description: "Crisp panko crumbed cottage cheese sticks with mint garlic dip.",
    price: 99,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-snack-108",
    categoryId: "puffs-fries",
    name: "Veg Spring Roll (6 pc)",
    description: "Crispy rolls filled with shredded cabbage, carrots, and glass noodles.",
    price: 99,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-snack-109",
    categoryId: "puffs-fries",
    name: "Crispy Fried Chicken",
    description: "Golden crunchy battered chicken bites with seasoned crust.",
    price: 99,
    isVeg: false,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-snack-110",
    categoryId: "puffs-fries",
    name: "Chicken Popcorn",
    description: "Bite-sized tender crispy chicken nuggets with peri peri dip.",
    price: 79,
    isVeg: false,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-snack-111",
    categoryId: "puffs-fries",
    name: "Chicken Cheese Balls",
    description: "Crisp fried chicken meatballs filled with gooey melted cheddar cheese.",
    price: 99,
    isVeg: false,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },

  // ==========================================
  // 4. SANDWICHES & MAGGI MANIA
  // ==========================================
  // Sandwiches
  {
    id: "arm-sand-101",
    categoryId: "sandwiches-maggi",
    name: "Corn Cheese Grill Sandwich",
    description: "Sweet golden corn and melted mozzarella grilled between buttered bread slices.",
    price: 99,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: [
      { name: "Extra Cheese Slice", price: 25 }
    ]
  },
  {
    id: "arm-sand-102",
    categoryId: "sandwiches-maggi",
    name: "Avocado Grill Sandwich (Special)",
    description: "Fresh buttery Hass avocado slices, herbs, tomatoes, and cheese grilled to perfection.",
    price: 129,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-sand-103",
    categoryId: "sandwiches-maggi",
    name: "Veg Cheese Grill Sandwich",
    description: "Classic cucumber, tomato, onion and cheese grilled sandwich with green chutney.",
    price: 79,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-sand-104",
    categoryId: "sandwiches-maggi",
    name: "Egg Cheese Grill Sandwich",
    description: "Fluffy egg omelette and cheese slice grilled inside buttered toast.",
    price: 99,
    isVeg: false,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-sand-105",
    categoryId: "sandwiches-maggi",
    name: "Bread Omelette",
    description: "Street-style spiced double egg omelette wrapped around toasted bread.",
    price: 79,
    isVeg: false,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },

  // Maggi Mania
  {
    id: "arm-maggi-101",
    categoryId: "sandwiches-maggi",
    name: "Veg Cheese Maggi",
    description: "Classic 2-minute noodles tossed with butter, sauteed veggies, and melted cheddar.",
    price: 79,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: [
      { name: "Extra Cheese Layer", price: 25 }
    ]
  },
  {
    id: "arm-maggi-102",
    categoryId: "sandwiches-maggi",
    name: "Corn Cheese Maggi",
    description: "Cheesy noodles packed with sweet corn kernels and aromatic masala.",
    price: 89,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-maggi-103",
    categoryId: "sandwiches-maggi",
    name: "Egg Cheese Maggi",
    description: "Scrambled egg and melted cheese tossed in spiced Maggi noodles.",
    price: 89,
    isVeg: false,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-maggi-104",
    categoryId: "sandwiches-maggi",
    name: "Soupy Maggi",
    description: "Warm comfort bowl of broth-style piping hot Maggi noodles.",
    price: 59,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },

  // ==========================================
  // 5. MOMOS, PASTA, BURGERS & PIZZA
  // ==========================================
  // Momos
  {
    id: "arm-momo-101",
    categoryId: "momo-pasta-burgers",
    name: "Paneer Momos (6 Pcs)",
    description: "Steamed Himalayan dumplings stuffed with spiced cottage cheese and herbs.",
    price: 99,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: [
      { name: "Extra Spicy Red Chili Dip", price: 20 },
      { name: "Creamy Mayo Dip", price: 20 }
    ]
  },
  {
    id: "arm-momo-102",
    categoryId: "momo-pasta-burgers",
    name: "Paneer Fried Momos (6 Pcs)",
    description: "Crisp deep-fried golden paneer momos served with fiery schezwan sauce.",
    price: 109,
    isVeg: true,
    isSpicy: true,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-momo-103",
    categoryId: "momo-pasta-burgers",
    name: "Veg Momos (6 Pcs)",
    description: "Steamed vegetable dumplings packed with finely minced cabbage and carrots.",
    price: 89,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-momo-104",
    categoryId: "momo-pasta-burgers",
    name: "Chicken Momos (6 pcs)",
    description: "Juicy steamed dumplings filled with spiced minced chicken and spring onions.",
    price: 119,
    isVeg: false,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-momo-105",
    categoryId: "momo-pasta-burgers",
    name: "Chicken Fried Momos (6 Pcs)",
    description: "Crunchy fried chicken dumplings tossed with pepper seasoning.",
    price: 129,
    isVeg: false,
    isSpicy: true,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },

  // Pasta
  {
    id: "arm-pasta-101",
    categoryId: "momo-pasta-burgers",
    name: "Cheese Macaroni",
    description: "Tender elbow macaroni smothered in rich velvety cheddar cheese sauce.",
    price: 99,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-pasta-102",
    categoryId: "momo-pasta-burgers",
    name: "Masala Penne Pasta",
    description: "Indian street-style spiced tomato penne pasta with veggies.",
    price: 99,
    isVeg: true,
    isSpicy: true,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-pasta-103",
    categoryId: "momo-pasta-burgers",
    name: "Mushroom Penne Pasta",
    description: "Button mushrooms sauteed in creamy white garlic herb sauce.",
    price: 99,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },

  // Burgers & Pizza
  {
    id: "arm-burger-101",
    categoryId: "momo-pasta-burgers",
    name: "Chicken Burger",
    description: "Crispy chicken patty with lettuce, cheese, and garlic mayo in a toasted sesame bun.",
    price: 129,
    isVeg: false,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-burger-102",
    categoryId: "momo-pasta-burgers",
    name: "Veg Burger",
    description: "Crisp vegetable patty with tomato, onion, lettuce and creamy burger mayo.",
    price: 99,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-pizza-101",
    categoryId: "momo-pasta-burgers",
    name: "Corn Cheese Pizza",
    description: "Thin crust pizza loaded with sweet corn and melted mozzarella cheese.",
    price: 119,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-pizza-102",
    categoryId: "momo-pasta-burgers",
    name: "Veg Cheese Pizza",
    description: "Capsicum, onion, tomato, and mozzarella pizza with oregano herb seasoning.",
    price: 119,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },

  // ==========================================
  // 6. SWEET TREATS (Brownies, Pastries, Buns)
  // ==========================================
  {
    id: "arm-sweet-101",
    categoryId: "sweet-treats",
    name: "Brownie with Icecream",
    description: "Warm fudgy chocolate brownie topped with a scoop of vanilla bean ice cream and chocolate syrup.",
    price: 79,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: [
      { name: "Extra Vanilla Ice Cream", price: 30 }
    ]
  },
  {
    id: "arm-sweet-102",
    categoryId: "sweet-treats",
    name: "Warm Chocolate Brownie",
    description: "Classic rich cocoa brownie with gooey chocolate center.",
    price: 59,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-sweet-103",
    categoryId: "sweet-treats",
    name: "Chocolate Pastry",
    description: "Decadent dark chocolate sponge layered with Dutch chocolate mousse.",
    price: 69,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-sweet-104",
    categoryId: "sweet-treats",
    name: "Butterscotch Pastry",
    description: "Vanilla sponge with butterscotch cream and crunchy caramel praline.",
    price: 59,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  },
  {
    id: "arm-sweet-105",
    categoryId: "sweet-treats",
    name: "Irani Maska Bun",
    description: "Soft sweet bakery bun lavishly spread with Amul butter and fruit jam.",
    price: 69,
    isVeg: true,
    isSpicy: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    portions: [],
    addons: []
  }
];
