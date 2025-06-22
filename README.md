# JavaScript Amazon Clone 🛒

**JavaScript Amazon Clone** is a client-side replica of Amazon’s e‑commerce flow—built using vanilla JavaScript, HTML, and CSS. Explore product listings, add items to cart, checkout, view orders, and track shipments!

---

### 🚀 Features

- **Product browsing**: View items with images, prices, descriptions.
- **Cart functionality**: Add, update, or remove items; view running total.
- **Checkout process**: Input shipping/payment info and confirm orders.
- **Order history**: Track past orders including order details and dates.
- **Order tracking**: Simulated shipment status updates.
- **Backend simulation**: API endpoints to support data operations (if using Express).
- **Persistent state**: Cart and orders stored in `localStorage` or backend.

---

### 🔧 Technologies Used

- **Front-end**: HTML5, CSS3 (flexbox/grid), JS (ES6 modules, callbacks/promises).
- **Backend (Optional)**: Node.js + Express.js + `data/*.json` files.
- **Storage**: `localStorage` or mock API endpoints fetch.
- **Bundling**: None—static pages or Express serve frontend/backend.

---

### 💾 Installation & Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/Dhanushkumarreddy0204/javascript-amazon-project-main.git
   cd javascript-amazon-project-main
cd backend
npm install
node index.js

Launch the app

If using only static pages, open amazon.html (and others) in your browser.

If leveraging backend, host the project root via a server like Live Server.

Navigate:
amazon.html → checkout.html → orders.html → tracking.html

