# VOLT — Performance Wear

A storefront made with HTML, CSS, and plain JavaScript. Supabase Auth handles email accounts; a protected `profiles` table stores basic account details.

## Run locally

Open the folder in VS Code and use Live Server, or run `python -m http.server 5500` and open `http://localhost:5500`. The site needs an internet connection for Supabase Auth and product photos.

## Pages

- `index.html` — Home and featured products
- `shop.html` — Product search, category, size, color, price, and sorting filters
- `product.html?id=...` — Product photos, variants, quantity, and add to bag
- `cart.html` — Saved bag, quantity controls, removal, subtotal, shipping estimate, and demo promo code
- `about.html` — Brand story
- `contact.html` — Frontend-only contact form
- `login.html` — Sign in, create an account, and reset a password
- `account.html` — Protected profile details and sign out
- `assets/js/supabase-config.js` — Public Supabase project URL and publishable key
- `supabase/migrations/20261015_create_profiles.sql` — Profile table, trigger, and row security rules

The shopping bag is stored in this browser's localStorage. Checkout, promo validation, contact, and newsletter interactions are demos; they do not submit orders or transmit form data.

## Set Up Supabase

1. Open the `VOLT` project in Supabase and confirm the URL and publishable key in `assets/js/supabase-config.js`.
2. In the Supabase SQL Editor, run `supabase/migrations/20261015_create_profiles.sql`.
3. In Authentication URL settings, allow `http://localhost:5500/**`, `http://127.0.0.1:5500/**`, and the deployed site URL before using email confirmation or password resets.
4. Create an account from `login.html`, confirm the email, then sign in and edit the profile.

The browser only receives the public publishable key. The profile table uses Row Level Security so each signed-in user can read and update their own row. Never add a service-role key or database password to browser files. The catalog and cart are still local demo data; connect those separately when their database behavior is defined.
