// 1. Show Featured Products On The Home Page
var homeProductList = document.getElementById("home-products");

if (homeProductList) {
  homeProductList.innerHTML = VoltCatalog.getFeatured(4).map(function (product) {
    return createProductCard(product);
  }).join("");
}

