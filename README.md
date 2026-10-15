# VOLT — Performance Wear

A frontend-only performance-wear storefront made with HTML, CSS, and plain JavaScript. Product data and cart storage are separated into small services so they can be replaced with API/database calls later.

## Run locally

Open `index.html` in a browser, or use VS Code's Live Server extension for automatic reloads. No package installation or build step is required.

## Pages

- `index.html` — Home and featured products
- `shop.html` — Product search, category, size, color, price, and sorting filters
- `product.html?id=...` — Product photos, variants, quantity, and add to bag
- `cart.html` — Saved bag, quantity controls, removal, subtotal, shipping estimate, and demo promo code
- `about.html` — Brand story
- `contact.html` — Frontend-only contact form

The demo bag is stored in this browser's localStorage. Checkout, promo validation, contact, and newsletter interactions are demos; they do not submit orders, transmit messages, or store customer data. Product photos load from Unsplash and require an internet connection.

## Add a backend later

Catalog data is in `assets/js/catalog.js`; cart persistence and calculations are in `assets/js/store.js`. The pages call those small interfaces rather than embedding data access in the markup. When a backend is ready, replace the catalog read methods and cart storage methods with `fetch()` calls to your API, then connect checkout and forms to their server endpoints. Keep credentials and payment secrets on the server.
