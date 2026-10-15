// 1. Cart Page Elements
var cartContent = document.getElementById("cart-content");
var appliedDiscount = 0;

// 2. Draw Cart Items And Order Summary
function showCart() {
  var cart = getCart();

  if (cart.length === 0) {
    cartContent.innerHTML = `
      <div class="empty-cart"><span class="empty-cart-mark">V.</span><h2>YOUR BAG IS WAITING.</h2><p>Find the gear that gets you moving.</p><a class="button button-red" href="shop.html">SHOP THE COLLECTION <span>↗</span></a></div>`;
    return;
  }

  var totals = getCartTotals(appliedDiscount);
  var itemCount = getCartCount();

  cartContent.innerHTML = `
    <div class="cart-layout">
      <section class="cart-items"><div class="cart-items-heading"><h2>YOUR ITEMS <span>(${itemCount})</span></h2><button type="button" id="empty-bag">EMPTY BAG</button></div>
        ${cart.map(function (item) {
          var product = VoltCatalog.getById(item.productId);
          return `<article class="cart-item" data-product-id="${escapeHTML(item.productId)}" data-size="${escapeHTML(item.size)}" data-color="${escapeHTML(item.color)}">
            <a class="cart-item-image" href="product.html?id=${encodeURIComponent(product.id)}"><img src="${getProductImage(product.images[0], 380)}" alt="${escapeHTML(product.name)}"></a>
            <div class="cart-item-details"><div><p class="product-category">${escapeHTML(product.category)}</p><a href="product.html?id=${encodeURIComponent(product.id)}"><h3>${escapeHTML(product.name)}</h3></a><p class="cart-variant">${escapeHTML(item.color)} / ${escapeHTML(item.size)}</p></div>
              <div class="cart-item-controls"><div class="quantity-control"><button type="button" data-cart-action="minus" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button type="button" data-cart-action="plus" aria-label="Increase quantity">+</button></div><strong>${formatPrice(product.price * item.quantity)}</strong><button class="remove-item" type="button" data-cart-action="remove">REMOVE</button></div>
            </div>
          </article>`;
        }).join("")}
      </section>
      <aside class="order-summary"><p class="eyebrow">ORDER SUMMARY</p><h2>THE TOTAL<span>.</span></h2>
        <div class="summary-line"><span>SUBTOTAL</span><strong>${formatPrice(totals.subtotal)}</strong></div>
        ${totals.discount ? '<div class="summary-line discount-line"><span>PROMO DISCOUNT</span><strong>−' + formatPrice(totals.discount) + '</strong></div>' : ""}
        <div class="summary-line"><span>SHIPPING</span><strong>${totals.shipping === 0 ? "FREE" : formatPrice(totals.shipping)}</strong></div>
        <p class="shipping-hint">${totals.subtotal >= FREE_SHIPPING_LIMIT ? "You unlocked free shipping." : "Free shipping on orders over EGP 2,000."}</p>
        <div class="summary-total"><span>TOTAL</span><strong>${formatPrice(totals.total)}</strong></div>
        <form class="promo-form" id="promo-form"><label class="sr-only" for="promo-code">Promo code</label><input id="promo-code" placeholder="ENTER PROMO CODE"><button type="submit">APPLY</button></form><p id="promo-message" class="promo-message" role="status"></p>
        <button class="button button-red checkout-button" type="button" id="demo-checkout">PROCEED TO CHECKOUT <span>→</span></button><p class="demo-note">Demo only — no payment is collected or order placed.</p><a class="continue-link" href="shop.html">＋ &nbsp; CONTINUE SHOPPING</a>
      </aside>
    </div>`;

  addCartEventListeners();
}

// 3. Quantity, Remove, And Empty-Bag Buttons
function addCartEventListeners() {
  document.querySelectorAll(".cart-item").forEach(function (cartItem) {
    cartItem.addEventListener("click", function (event) {
      var button = event.target.closest("[data-cart-action]");
      if (!button) return;

      var productId = cartItem.dataset.productId;
      var size = cartItem.dataset.size;
      var color = cartItem.dataset.color;
      var cartRecord = getCart().find(function (item) {
        return item.productId === productId && item.size === size && item.color === color;
      });

      if (button.dataset.cartAction === "remove") removeCartItem(productId, size, color);
      if (button.dataset.cartAction === "minus") updateCartItem(productId, size, color, cartRecord.quantity - 1);
      if (button.dataset.cartAction === "plus") updateCartItem(productId, size, color, cartRecord.quantity + 1);
      showCart();
    });
  });

  document.getElementById("empty-bag").addEventListener("click", function () {
    clearCart();
    appliedDiscount = 0;
    showCart();
  });

  document.getElementById("demo-checkout").addEventListener("click", function () {
    document.getElementById("promo-message").textContent = "Checkout is a demo. No payment or order was made.";
  });

  document.getElementById("promo-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var promoCode = document.getElementById("promo-code").value.trim().toUpperCase();

    if (promoCode === "VOLT10") {
      appliedDiscount = 10;
      showCart();
      document.getElementById("promo-message").textContent = "VOLT10 applied — 10% off.";
    } else {
      document.getElementById("promo-message").textContent = "That demo code was not recognized.";
    }
  });
}

showCart();
