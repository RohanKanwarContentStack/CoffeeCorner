# CoffeeCorner

Coffee shop app with products, menu listing, product details, cart, and checkout.

## Structure

- **Auth** – Login, signup, profiles (create/select/switch/manage), account settings
- **Products** – In-memory catalog (Hot, Cold, Pastries) in `src/data/products.js`
- **Cart** – Add/remove/update quantity, clear; persisted per user/profile
- **Pages** – Home (featured/trending), Menu (with category filter), Product detail, Cart, Checkout, Search results

## Run

```bash
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000). Log in or sign up, create/select a profile, then browse the menu, add to cart, and checkout.
