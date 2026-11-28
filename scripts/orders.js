import { listOrders } from '../data/orders.js';
import { addToCart } from '../data/cart.js';
import { getProduct, loadProducts } from '../data/products.js';
import { formatDate } from '../data/deliveryOptions.js';
import { formatCurrency } from './utils/money.js';
import { updateCartBadge, showMessage, showCartError, showCatalogError } from './shared.js';

updateCartBadge();
const orders = listOrders();
const grid = document.querySelector('.orders-grid');

if (!orders.length) {
  grid.innerHTML = '<p>You have no orders yet. <a class="link-primary" href="amazon.html">Browse products</a></p>';
} else {
  for (const order of orders) {
    const view = document.querySelector('#order').content.cloneNode(true);
    const placed = view.querySelector('time');
    placed.dateTime = order.placedAt;
    placed.textContent = new Date(order.placedAt).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    view.querySelector('.order-total span').textContent = '$' + formatCurrency(order.totalCents);
    view.querySelector('.order-header-right-section span').textContent = order.id;
    const details = view.querySelector('.order-details-grid');
    for (const item of order.items) {
      const row = document.querySelector('#order-item').content.cloneNode(true);
      row.querySelector('.product-name').textContent = item.name;
      row.querySelector('.product-image-container img').src = item.image;
      const delivered = Date.now() >= Date.parse(item.arrivesAt);
      row.querySelector('.product-delivery-date').textContent =
        (delivered ? 'Delivered on ' : 'Arriving on ') + formatDate(item.arrivesAt);
      row.querySelector('.product-quantity').textContent = 'Quantity: ' + item.quantity;
      const params = new URLSearchParams({ orderId: order.id, productId: item.productId });
      row.querySelector('.track-package-button').href = 'tracking.html?' + params;
      const buy = row.querySelector('.buy-again-button');
      buy.disabled = true;
      buy.dataset.productId = item.productId;
      details.append(row);
    }
    grid.append(view);
  }

  // Keep saved receipts and tracking available even when the live catalog fails.
  loadProducts().then(() => {
    for (const button of grid.querySelectorAll('.buy-again-button')) {
      const product = getProduct(button.dataset.productId);
      if (!product) {
        button.textContent = 'Unavailable';
        continue;
      }
      button.disabled = false;
      button.onclick = () => {
        try {
          addToCart(product.id);
          updateCartBadge();
          showMessage(`Added one ${product.name} to your cart.`);
        } catch (error) {
          showCartError(error);
        }
      };
    }
  }).catch(showCatalogError);
}
