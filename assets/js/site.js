// 1. Shared Site Sections: Announcement, Navigation, And Footer
var siteHeader = document.getElementById("site-header");
var siteFooter = document.getElementById("site-footer");
var currentPage = document.body.dataset.page;

if (siteHeader) {
  siteHeader.innerHTML = `
    <div class="announcement"><span>BUILT FOR YOUR NEXT REP</span><i></i><span>FREE SHIPPING OVER EGP 2,000</span></div>
    <header class="site-header">
      <div class="wrap nav-bar">
        <button class="menu-toggle" id="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
        <a class="wordmark" href="index.html" aria-label="VOLT home">VOLT<span>.</span></a>
        <nav class="main-nav" id="main-nav" aria-label="Main navigation">
          <a href="index.html" data-link="home">HOME</a>
          <a href="shop.html" data-link="shop">SHOP</a>
          <a href="about.html" data-link="about">ABOUT</a>
          <a href="contact.html" data-link="contact">CONTACT</a>
        </nav>
        <div class="nav-actions">
          <a class="icon-link search-action" href="shop.html#search" aria-label="Search the shop">⌕</a>
          <a class="bag-link" href="cart.html" aria-label="Shopping bag">BAG <span id="bag-count">0</span><i class="bag-dot"></i></a>
        </div>
      </div>
    </header>`;

  var activeLink = siteHeader.querySelector('[data-link="' + currentPage + '"]');
  if (activeLink) activeLink.classList.add("active");

  var menuButton = document.getElementById("menu-toggle");
  var mainNav = document.getElementById("main-nav");
  menuButton.addEventListener("click", function () {
    var isOpen = mainNav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", isOpen);
  });
}

if (siteFooter) {
  siteFooter.innerHTML = `
    <footer class="site-footer">
      <div class="wrap footer-main">
        <div class="footer-brand"><a class="wordmark" href="index.html">VOLT<span>.</span></a><p>BUILT FOR REAL WORK.</p><a class="footer-email" href="mailto:hello@volt.example">HELLO@VOLT.EXAMPLE ↗</a></div>
        <div class="footer-column"><h2>EXPLORE</h2><a href="shop.html">Shop all</a><a href="about.html">Our story</a><a href="contact.html">Contact</a></div>
        <div class="footer-column"><h2>FOLLOW THE WORK</h2><a href="https://instagram.com/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://tiktok.com/" target="_blank" rel="noreferrer">TikTok ↗</a></div>
        <div class="footer-note"><p>NO SHORTCUTS.<br>JUST SHOW UP.</p><span>BUILT TO MOVE / VOLT 2025</span></div>
      </div>
      <div class="wrap footer-bottom"><span>© 2025 VOLT PERFORMANCE WEAR</span><span>TRAIN HARDER. LIVE STRONGER.</span></div>
    </footer>`;
}

// 2. Update The Header Cart Count
function updateBagCount() {
  var bagCount = document.getElementById("bag-count");
  if (bagCount) bagCount.textContent = getCartCount();
}

updateBagCount();
window.addEventListener("volt-cart-updated", updateBagCount);
window.addEventListener("storage", updateBagCount);

// 3. Demo Newsletter Form (Does Not Send Data)
document.querySelectorAll("[data-demo-form]").forEach(function (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var note = form.querySelector(".form-note");
    note.textContent = "Thanks for your interest — this demo does not save email addresses.";
  });
});
