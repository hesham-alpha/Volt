// 1. Shared Product Card
// This card is used on the home, shop, and product pages.
function createProductCard(product) {
  var badge = product.badge ? '<span class="product-badge">' + escapeHTML(product.badge) + '</span>' : "";
  var oldPrice = product.oldPrice ? '<del>' + formatPrice(product.oldPrice) + '</del>' : "";

  return `
    <article class="product-card">
      <a class="product-image" href="product.html?id=${encodeURIComponent(product.id)}" aria-label="View ${escapeHTML(product.name)}">
        <img src="${getProductImage(product.images[0], 700)}" alt="${escapeHTML(product.name)}" loading="lazy">
        ${badge}<span class="quick-view">VIEW PRODUCT <b>↗</b></span>
      </a>
      <div class="product-card-info">
        <div><p class="product-category">${escapeHTML(product.category)}</p><a href="product.html?id=${encodeURIComponent(product.id)}"><h3>${escapeHTML(product.name)}</h3></a></div>
        <div class="product-prices">${oldPrice}<span>${formatPrice(product.price)}</span></div>
      </div>
      <div class="product-card-bottom"><div class="mini-swatches">${product.colors.map(function (color, index) {
        return '<span class="mini-swatch ' + (index === 0 ? "selected" : "") + '" style="--swatch:' + color.value + '" title="' + escapeHTML(color.name) + '"></span>';
      }).join("")}</div><span class="card-arrow">↗</span></div>
      <button class="quick-add" type="button" data-quick-add="${escapeHTML(product.id)}">QUICK ADD +</button>
    </article>`;
}

// 2. Quick Add Uses The First Available Size And Color
document.addEventListener("click", function (event) {
  var addButton = event.target.closest("[data-quick-add]");
  if (!addButton) return;

  var product = VoltCatalog.getById(addButton.dataset.quickAdd);
  if (!product) return;

  addToCart(product.id, product.sizes[0], product.colors[0].name, 1);
  addButton.textContent = "ADDED ✓";
  window.setTimeout(function () { addButton.textContent = "QUICK ADD +"; }, 1200);
});
