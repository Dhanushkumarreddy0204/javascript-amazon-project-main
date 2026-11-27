import { readShop, addToCart, displayCount } from '../data/cart.js';
import { getProduct } from '../data/products.js';
import { displayDate } from '../data/orders.js';
import { formatcurrency } from './utils/money.js';

const grid = document.querySelector('.orders-grid');

function orderItem(order, item) {
  const product = getProduct(item.productId);
  const params = new URLSearchParams({ order: order.id, product: product.id });
  return `<div class="product-image-container"><img src="${product.image}" alt=""></div>
    <div><div class="product-name">${product.name}</div>
      <div class="product-delivery-date">Estimated arrival: ${displayDate(item.arrival)}</div>
      <div class="product-quantity">Quantity: ${item.quantity} · $${formatcurrency(item.priceCents)} each</div>
      <button class="buy-again-button button-primary" data-id="${product.id}">
        <img class="buy-again-icon" src="images/icons/buy-again.png" alt="">Buy it again</button></div>
    <a class="track-package-button button-secondary" href="tracking.html?${params}">Track package</a>`;
}

function render() {
  grid.innerHTML = readShop().orders.map(order => `<section class="order-container">
    <div class="order-header"><div class="order-header-left-section">
      <div class="order-date"><strong>Order placed</strong><div>${displayDate(order.placed)}</div></div>
      <div class="order-total"><strong>Total</strong><div>$${formatcurrency(order.total)}</div></div></div>
      <div class="order-header-right-section"><strong>Order ID</strong><div>${order.id}</div></div></div>
    <div class="order-details-grid">${order.items.map(item => orderItem(order, item)).join('')}</div>
    </section>`).join('') || '<p>No orders yet. <a href="amazon.html">Browse products</a></p>';
  displayCount();
}
grid.addEventListener('click', async event => {
  const button = event.target.closest('button[data-id]');
  if (!button) return;
  try {
    await addToCart(button.dataset.id);
    displayCount();
    button.textContent = 'Added to cart';
  } catch (error) { alert(error.message); }
});
window.addEventListener('pageshow', render);
window.addEventListener('storage', render);
render();
