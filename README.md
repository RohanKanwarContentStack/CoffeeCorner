# CoffeeCorner

Coffee shop app with products, menu listing, product details, cart, checkout, and an in-app chatbot for suggestions.

## Structure

- **Auth** – Login, signup, account settings (no profiles)
- **Products** – In-memory catalog (Hot, Cold, Pastries) in `src/data/products.js`
- **Cart** – Add/remove/update quantity, clear; persisted per user
- **Pages** – Home (featured/trending), Menu (with category filter), Product detail, Cart, Checkout, Search results
- **ChatBot** – Product suggestions, recommendations by category, and fallback to Contentstack Automations API when the question isn’t answerable from local data (optional; set `REACT_APP_AUTOMATIONS_API_URL` in `.env`)

## Run

```bash
npm install
npm start
```

The dev server runs at [http://localhost:3000](http://localhost:3000) by default. Log in or sign up, then browse the menu, add to cart, and checkout.
