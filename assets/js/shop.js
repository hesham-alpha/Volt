// 1. Shop Page Elements
var shopProducts = document.getElementById("shop-products");
var searchInput = document.getElementById("shop-search");
var sortSelect = document.getElementById("sort-products");
var categoryFilters = document.getElementById("category-filters");
var sizeFilters = document.getElementById("size-filters");
var colorFilters = document.getElementById("color-filters");
var priceFilter = document.getElementById("price-filter");
var activeFilters = document.getElementById("active-filters");

var selectedCategory = new URLSearchParams(window.location.search).get("category") || "All";
var selectedSizes = [];
var selectedColors = [];

// 2. Build Filter Options From The Product Catalog
function createCategoryFilters() {
  var categories = ["All"].concat(VoltCatalog.getCategories());
  categoryFilters.innerHTML = categories.map(function (category) {
    return `<button type="button" class="category-filter ${category === selectedCategory ? "selected" : ""}" data-category="${escapeHTML(category)}">${escapeHTML(category)}<span>(${countCategory(category)})</span></button>`;
  }).join("");
}

function countCategory(category) {
  if (category === "All") return VoltCatalog.getAll().length;
  return VoltCatalog.getAll().filter(function (product) { return product.category === category; }).length;
}

function createSizeFilters() {
  var sizes = ["S", "M", "L", "XL", "XXL", "OS"];
  sizeFilters.innerHTML = sizes.map(function (size) {
    return `<label class="filter-check"><input type="checkbox" value="${size}" data-size-filter><span>${size}</span></label>`;
  }).join("");
}

function createColorFilters() {
  var colors = [];

  VoltCatalog.getAll().forEach(function (product) {
    product.colors.forEach(function (color) {
      if (!colors.some(function (savedColor) { return savedColor.name === color.name; })) {
        colors.push(color);
      }
    });
  });

  colorFilters.innerHTML = colors.map(function (color) {
    return `<label class="color-filter" title="${escapeHTML(color.name)}"><input type="checkbox" value="${escapeHTML(color.name)}" data-color-filter><span style="--swatch:${color.value}"></span><small>${escapeHTML(color.name)}</small></label>`;
  }).join("");
}

createCategoryFilters();
createSizeFilters();
createColorFilters();

// 3. Apply Search, Filters, And Sorting
function getVisibleProducts() {
  var searchText = searchInput.value.trim().toLowerCase();
  var maximumPrice = Number(priceFilter.value);
  var products = VoltCatalog.getAll().filter(function (product) {
    var matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    var matchesSearch = (product.name + " " + product.category).toLowerCase().includes(searchText);
    var matchesPrice = product.price <= maximumPrice;
    var matchesSize = selectedSizes.length === 0 || selectedSizes.some(function (size) { return product.sizes.includes(size); });
    var matchesColor = selectedColors.length === 0 || selectedColors.some(function (color) {
      return product.colors.some(function (productColor) { return productColor.name === color; });
    });

    return matchesCategory && matchesSearch && matchesPrice && matchesSize && matchesColor;
  });

  if (sortSelect.value === "price-low") products.sort(function (a, b) { return a.price - b.price; });
  if (sortSelect.value === "price-high") products.sort(function (a, b) { return b.price - a.price; });
  if (sortSelect.value === "name") products.sort(function (a, b) { return a.name.localeCompare(b.name); });
  return products;
}

function showProducts() {
  var products = getVisibleProducts();
  document.getElementById("result-count").textContent = products.length + " PIECES";
  document.getElementById("no-results").classList.toggle("hidden", products.length > 0);
  shopProducts.classList.toggle("hidden", products.length === 0);
  shopProducts.innerHTML = products.map(function (product) { return createProductCard(product); }).join("");
  showActiveFilters();
}

function showActiveFilters() {
  var tags = [];
  if (selectedCategory !== "All") tags.push(selectedCategory);
  selectedSizes.forEach(function (size) { tags.push(size); });
  selectedColors.forEach(function (color) { tags.push(color); });
  activeFilters.innerHTML = tags.map(function (tag) { return '<span class="active-filter">' + escapeHTML(tag) + '</span>'; }).join("");
  document.getElementById("price-value").textContent = formatPrice(priceFilter.value);
}

// 4. Handle Shop Filter Interactions
categoryFilters.addEventListener("click", function (event) {
  var button = event.target.closest("[data-category]");
  if (!button) return;

  selectedCategory = button.dataset.category;
  categoryFilters.querySelectorAll(".category-filter").forEach(function (filter) {
    filter.classList.toggle("selected", filter.dataset.category === selectedCategory);
  });
  showProducts();
});

sizeFilters.addEventListener("change", function () {
  selectedSizes = Array.from(sizeFilters.querySelectorAll("input:checked")).map(function (input) { return input.value; });
  showProducts();
});

colorFilters.addEventListener("change", function () {
  selectedColors = Array.from(colorFilters.querySelectorAll("input:checked")).map(function (input) { return input.value; });
  showProducts();
});

searchInput.addEventListener("input", showProducts);
sortSelect.addEventListener("change", showProducts);
priceFilter.addEventListener("input", showProducts);

function clearFilters() {
  selectedCategory = "All";
  selectedSizes = [];
  selectedColors = [];
  searchInput.value = "";
  sortSelect.value = "featured";
  priceFilter.value = priceFilter.max;
  categoryFilters.querySelectorAll(".category-filter").forEach(function (filter) {
    filter.classList.toggle("selected", filter.dataset.category === "All");
  });
  sizeFilters.querySelectorAll("input").forEach(function (input) { input.checked = false; });
  colorFilters.querySelectorAll("input").forEach(function (input) { input.checked = false; });
  showProducts();
}

document.getElementById("clear-filters").addEventListener("click", clearFilters);
document.getElementById("reset-empty").addEventListener("click", clearFilters);

// 5. Focus Search When The Header Search Link Is Used
if (window.location.hash === "#search") {
  searchInput.focus();
  document.getElementById("shop-search").scrollIntoView({ behavior: "smooth", block: "center" });
}

showProducts();
