# JavaScript Amazon Clone

A browser-based shopping demo built with HTML, CSS, and vanilla JavaScript. The catalog includes 42 products, with photos, prices, ratings, and searchable keywords.

## Run locally

From the project root, start a static HTTP server:

```sh
python -m http.server 8000
```

Open [the catalog](http://localhost:8000/amazon.html). An editor's Live Server extension also works. Serve the whole folder so the browser can load JavaScript modules and `backend/products.json`.

## Shopping flow

1. Search by product name or keyword, choose a quantity, and add it to the cart.
2. Open checkout to change quantities, remove products, or select delivery for each item. Shipping applies once per product line. The demo estimates 10% tax on items and shipping, rounded to the nearest cent.
3. Select **Place your order** to save a receipt and clear the cart. This demo checkout records orders locally without collecting payment.
4. Open **Your Orders** to see saved receipts, add one unit of a product again, or track a specific item. Simulated shipments switch to Shipped halfway through the selected delivery period and Delivered on arrival.

The cart survives refreshes within the tab using session storage. Orders use local storage and remain available across visits in the same browser profile at the same site address.

## Screenshots

![Product listing](./image/Screenshot%202025-06-22%20183906.png)
![Checkout](./image/Screenshot%202025-06-22%20183935.png)
