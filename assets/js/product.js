// 1. Find The Product From The Page URL
var productId = new URLSearchParams(window.location.search).get("id");
var currentProduct = VoltCatalog.getById(productId) || VoltCatalog.getAll()[0];
var selectedSize = "";
var selectedColor = currentProduct.colors[0];
var quantity = 1;
var activeImageIndex = 0;
var productDetail = document.getElementById("product-detail");

document.title = currentProduct.name + " — VOLT Performance Wear";
document.getElementById("breadcrumb-product").textContent = currentProduct.name.toUpperCase();

// 2. Build The Product Page
function showProductDetails() {
  productDetail.innerHTML = `
    <div class="product-gallery">
      <div class="thumbnail-list" id="thumbnail-list">${currentProduct.images.map(function (image, index) {
        return `<button class="thumbnail-button ${index === activeImageIndex ? "selected" : ""}" type="button" data-image-index="${index}" aria-label="Show product photo ${index + 1}"><img src="${getProductImage(image, 180)}" alt=""></button>`;
      }).join("")}</div>
      <div class="main-product-image"><img id="main-product-image" src="${getProductImage(currentProduct.images[activeImageIndex], 1000)}" alt="${escapeHTML(currentProduct.name)}"></div>
      <span class="gallery-count">0${activeImageIndex + 1} / 0${currentProduct.images.length}</span>
    </div>
    <section class="product-information">
      <p class="eyebrow">${escapeHTML(currentProduct.category)} / PERFORMANCE COLLECTION</p>
      <h1>${escapeHTML(currentProduct.name)}</h1>
      <div class="rating-line"><span aria-label="4 out of 5 stars">★★★★<i>★</i></span><small>4.8 / 5 &nbsp; (24 REVIEWS)</small></div>
      <p class="detail-price">${formatPrice(currentProduct.price)} ${currentProduct.oldPrice ? '<del>' + formatPrice(currentProduct.oldPrice) + '</del>' : ""}</p>
      <p class="detail-description">${escapeHTML(currentProduct.description)}</p>
      <div class="product-option"><div class="option-title"><span>SIZE</span><button type="button" id="size-guide">SIZE GUIDE ↗</button></div><div class="size-buttons" id="size-buttons">${currentProduct.sizes.map(function (size) {
        return `<button class="size-button" type="button" data-size="${size}">${size}</button>`;
      }).join("")}</div><p class="selection-message" id="size-message" role="status"></p></div>
      <div class="product-option"><div class="option-title"><span>COLOR</span><span id="selected-color-name">${escapeHTML(selectedColor.name)}</span></div><div class="detail-colors" id="detail-colors">${currentProduct.colors.map(function (color, index) {
        return `<button class="detail-color ${index === 0 ? "selected" : ""}" type="button" data-color="${escapeHTML(color.name)}" style="--swatch:${color.value}" aria-label="${escapeHTML(color.name)}" title="${escapeHTML(color.name)}"></button>`;
      }).join("")}</div></div>
      <div class="product-option quantity-option"><span class="option-label">QUANTITY</span><div class="quantity-control"><button id="quantity-minus" type="button" aria-label="Decrease quantity">−</button><span id="quantity-value">1</span><button id="quantity-plus" type="button" aria-label="Increase quantity">+</button></div></div>
      <button class="button button-red add-to-cart" type="button" id="add-to-cart">ADD TO BAG — ${formatPrice(currentProduct.price)} <span>↗</span></button>
      <p class="add-message" id="add-message" role="status"></p>
      <div class="product-promises"><span>◈ &nbsp; EASY 30-DAY RETURNS</span><span>↗ &nbsp; FREE SHIPPING OVER EGP 2,000</span><span>✳ &nbsp; BUILT FOR REAL WORK</span></div>
    </section>`;

  document.getElementById("size-guide").addEventListener("click", function () {
    document.getElementById("size-message").textContent = "Relaxed athletic fit. Between sizes? Go one size up.";
  });

  document.getElementById("size-buttons").addEventListener("click", function (event) {
    var sizeButton = event.target.closest("[data-size]");
    if (!sizeButton) return;

    selectedSize = sizeButton.dataset.size;
    document.querySelectorAll(".size-button").forEach(function (button) {
      button.classList.toggle("selected", button.dataset.size === selectedSize);
    });
    document.getElementById("size-message").textContent = "";
  });

  document.getElementById("detail-colors").addEventListener("click", function (event) {
    var colorButton = event.target.closest("[data-color]");
    if (!colorButton) return;

    selectedColor = currentProduct.colors.find(function (color) { return color.name === colorButton.dataset.color; });
    document.getElementById("selected-color-name").textContent = selectedColor.name;
    document.querySelectorAll(".detail-color").forEach(function (button) {
      button.classList.toggle("selected", button.dataset.color === selectedColor.name);
    });
  });

  document.getElementById("thumbnail-list").addEventListener("click", function (event) {
    var thumbnail = event.target.closest("[data-image-index]");
    if (!thumbnail) return;

    activeImageIndex = Number(thumbnail.dataset.imageIndex);
    document.getElementById("main-product-image").src = getProductImage(currentProduct.images[activeImageIndex], 1000);
    document.querySelectorAll(".thumbnail-button").forEach(function (button) {
      button.classList.toggle("selected", Number(button.dataset.imageIndex) === activeImageIndex);
    });
    document.querySelector(".gallery-count").textContent = "0" + (activeImageIndex + 1) + " / 0" + currentProduct.images.length;
  });

  document.getElementById("quantity-minus").addEventListener("click", function () { changeQuantity(-1); });
  document.getElementById("quantity-plus").addEventListener("click", function () { changeQuantity(1); });
  document.getElementById("add-to-cart").addEventListener("click", addCurrentProductToCart);
}

// 3. Product Quantity And Add-To-Bag Actions
function changeQuantity(amount) {
  quantity = Math.max(1, quantity + amount);
  document.getElementById("quantity-value").textContent = quantity;
  document.getElementById("add-to-cart").innerHTML = "ADD TO BAG — " + formatPrice(currentProduct.price * quantity) + " <span>↗</span>";
}

function addCurrentProductToCart() {
  var sizeMessage = document.getElementById("size-message");
  var addMessage = document.getElementById("add-message");

  if (!selectedSize) {
    sizeMessage.textContent = "CHOOSE A SIZE BEFORE ADDING THIS ITEM.";
    return;
  }

  addToCart(currentProduct.id, selectedSize, selectedColor.name, quantity);
  addMessage.textContent = "ADDED TO YOUR BAG ✓";
}

// 4. Show A Few Related Products
function showRelatedProducts() {
  var related = VoltCatalog.getAll().filter(function (product) { return product.id !== currentProduct.id; }).slice(0, 4);
  document.getElementById("related-products").innerHTML = related.map(function (product) { return createProductCard(product); }).join("");
}

showProductDetails();
showRelatedProducts();
