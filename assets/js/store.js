// 1. Cart Settings
// Replace these functions with API requests when a backend is ready.
var CART_STORAGE_KEY = "volt-demo-cart-v1";
var FREE_SHIPPING_LIMIT = 2000;
var SHIPPING_PRICE = 80;

// 2. Read Cart Items From This Browser
function getCart() {
  try {
    var savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");

    if (!Array.isArray(savedCart)) {
      return [];
    }

    // Keep only items that still exist in the product catalog.
    return savedCart.filter(function (item) {
      var product = window.VoltCatalog.getById(item.productId);
      if (!product) return false;

      var sizeExists = product.sizes.includes(item.size);
      var colorExists = product.colors.some(function (color) {
        return color.name === item.color;
      });

      return sizeExists && colorExists && Number(item.quantity) > 0;
    });
  } catch (error) {
    return [];
  }
}

// 3. Save Cart And Add Products
function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent("volt-cart-updated"));
}

function addToCart(productId, size, colorName, quantity) {
  var cart = getCart();
  var matchingItem = cart.find(function (item) {
    return item.productId === productId && item.size === size && item.color === colorName;
  });

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({ productId: productId, size: size, color: colorName, quantity: quantity });
  }

  saveCart(cart);
}

// 4. Update Quantity Or Remove Products
function updateCartItem(productId, size, colorName, quantity) {
  var cart = getCart();

  if (quantity < 1) {
    removeCartItem(productId, size, colorName);
    return;
  }

  var item = cart.find(function (cartItem) {
    return cartItem.productId === productId && cartItem.size === size && cartItem.color === colorName;
  });

  if (item) {
    item.quantity = quantity;
    saveCart(cart);
  }
}

function removeCartItem(productId, size, colorName) {
  var cart = getCart().filter(function (item) {
    return !(item.productId === productId && item.size === size && item.color === colorName);
  });

  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

// 5. Calculate Item Count And Totals
function getCartCount() {
  return getCart().reduce(function (total, item) {
    return total + item.quantity;
  }, 0);
}

function getCartTotals(discountPercent) {
  var subtotal = getCart().reduce(function (total, item) {
    var product = window.VoltCatalog.getById(item.productId);
    return total + product.price * item.quantity;
  }, 0);

  var discount = Math.round(subtotal * (discountPercent || 0) / 100);
  var afterDiscount = subtotal - discount;
  var shipping = afterDiscount === 0 || afterDiscount >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_PRICE;

  return {
    subtotal: subtotal,
    discount: discount,
    shipping: shipping,
    total: afterDiscount + shipping
  };
}

// 6. Shared Page Helpers
function formatPrice(price) {
  return "EGP " + Number(price).toLocaleString("en-US");
}

function getProductImage(imageId, width) {
  return "https://images.unsplash.com/" + imageId + "?auto=format&fit=crop&w=" + (width || 700) + "&q=85";
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    var characters = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return characters[character];
  });
}
