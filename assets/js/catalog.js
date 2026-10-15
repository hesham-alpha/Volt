// 1. Product Data
// Update products here, or replace this list with a fetch request to your API later.
window.VoltProducts = [
  {
    id: "oversized-tee",
    name: "Oversized T-Shirt",
    category: "T-Shirts",
    price: 750,
    oldPrice: 900,
    badge: "BEST SELLER",
    description: "A relaxed training tee with a clean VOLT chest mark. Soft, breathable cotton for the gym and everything after.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Black", value: "#151616" }, { name: "Charcoal", value: "#646563" }, { name: "Bone", value: "#d4d1c9" }],
    images: ["photo-1521572163474-6864f9cf17ab", "photo-1503342217505-b0a15ec3261c", "photo-1523381210434-271e8be1f52b"]
  },
  {
    id: "graphic-tee",
    name: "Graphic Tee",
    category: "T-Shirts",
    price: 800,
    badge: "NEW",
    description: "A graphic tee with a bold back print, relaxed shoulders, and a training-ready everyday fit.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Black", value: "#151616" }, { name: "Charcoal", value: "#646563" }],
    images: ["photo-1503342217505-b0a15ec3261c", "photo-1521572163474-6864f9cf17ab", "photo-1523381210434-271e8be1f52b"]
  },
  {
    id: "essential-tee",
    name: "Essential Tee",
    category: "T-Shirts",
    price: 700,
    description: "The no-fuss essential. Lightweight, easy to layer, and ready for the next session.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Bone", value: "#d4d1c9" }, { name: "Black", value: "#151616" }],
    images: ["photo-1523381210434-271e8be1f52b", "photo-1521572163474-6864f9cf17ab", "photo-1503342217505-b0a15ec3261c"]
  },
  {
    id: "performance-tank",
    name: "Performance Tank",
    category: "Tank Tops",
    price: 650,
    badge: "BEST SELLER",
    description: "A lightweight training tank with a clean athletic cut. Built to keep you moving through every rep.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Black", value: "#151616" }, { name: "White", value: "#efefeb" }, { name: "Charcoal", value: "#646563" }],
    images: ["photo-1583454110551-21f2fa2afe61", "photo-1517836357463-d25dfeac3438", "photo-1534438327276-14e5300c3a48"]
  },
  {
    id: "training-tank",
    name: "Training Tank",
    category: "Tank Tops",
    price: 550,
    description: "A breathable, easy-fit tank for warm sessions and everyday wear.",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Black", value: "#151616" }, { name: "Bone", value: "#d4d1c9" }],
    images: ["photo-1517836357463-d25dfeac3438", "photo-1583454110551-21f2fa2afe61", "photo-1515886657613-9f3515b0c78f"]
  },
  {
    id: "gym-shorts",
    name: "Gym Shorts",
    category: "Shorts",
    price: 600,
    badge: "BEST SELLER",
    description: "Lightweight training shorts with an adjustable waist and room to move.",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Black", value: "#151616" }, { name: "Charcoal", value: "#646563" }],
    images: ["photo-1591195853828-11db59a44f6b", "photo-1517836357463-d25dfeac3438", "photo-1583454110551-21f2fa2afe61"]
  },
  {
    id: "training-shorts",
    name: "Training Shorts",
    category: "Shorts",
    price: 680,
    description: "An everyday short with a secure fit, useful pockets, and a no-distraction feel.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Black", value: "#151616" }, { name: "Olive", value: "#6f725c" }],
    images: ["photo-1517836357463-d25dfeac3438", "photo-1591195853828-11db59a44f6b", "photo-1583454110551-21f2fa2afe61"]
  },
  {
    id: "volt-hoodie",
    name: "VOLT Hoodie",
    category: "Hoodies",
    price: 1200,
    badge: "LOW STOCK",
    description: "A heavyweight fleece hoodie with a relaxed fit for warm-ups and cool-downs.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Black", value: "#151616" }, { name: "Charcoal", value: "#646563" }, { name: "Bone", value: "#d4d1c9" }],
    images: ["photo-1556821840-3a63f95609a7", "photo-1578681994506-b8f463449011", "photo-1556821840-3a63f95609a7"]
  },
  {
    id: "lift-cap",
    name: "Lift Cap",
    category: "Accessories",
    price: 450,
    description: "A simple six-panel cap with an adjustable strap and a small embroidered VOLT mark.",
    sizes: ["OS"],
    colors: [{ name: "Black", value: "#151616" }, { name: "Bone", value: "#d4d1c9" }],
    images: ["photo-1521369909029-2afed882baee", "photo-1588850561407-ed78c282e89b", "photo-1521369909029-2afed882baee"]
  },
  {
    id: "training-bag",
    name: "Training Bag",
    category: "Accessories",
    price: 1100,
    description: "A roomy training bag with space for your essentials, shoes, and a change of clothes.",
    sizes: ["OS"],
    colors: [{ name: "Black", value: "#151616" }, { name: "Olive", value: "#6f725c" }],
    images: ["photo-1553062407-98eeb64c6a62", "photo-1622560480654-d96214fdc887", "photo-1553062407-98eeb64c6a62"]
  }
];

// 2. Product Lookup Helpers
window.VoltCatalog = {
  getAll: function () {
    return window.VoltProducts;
  },

  getById: function (id) {
    return window.VoltProducts.find(function (product) {
      return product.id === id;
    });
  },

  getFeatured: function (numberOfProducts) {
    return window.VoltProducts.slice(0, numberOfProducts);
  },

  getCategories: function () {
    return [...new Set(window.VoltProducts.map(function (product) {
      return product.category;
    }))];
  }
};
