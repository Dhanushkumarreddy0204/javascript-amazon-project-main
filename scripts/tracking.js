import { readShop, displayCount } from '../data/cart.js';
import { getProduct } from '../data/products.js';
import { displayDate } from '../data/orders.js';

const params = new URLSearchParams(location.search);
const order = readShop().orders.find(order => order.id === params.get('order'));
const item = order?.items.find(item => item.productId === params.get('product'));
const shipment = document.querySelector('#shipment');
displayCount();
if (item) {
  const product = getProduct(item.productId);
  shipment.innerHTML = `<div class="delivery-date">Estimated arrival: ${displayDate(item.arrival)}</div>
    <div class="product-info">${product.name}</div>
    <div class="product-info">Quantity: ${item.quantity}</div>
    <img class="product-image" src="${product.image}" alt="">
    <div class="current-status">Order placed</div>
    <p>Tracking for this browser demo uses the delivery estimate selected at checkout.</p>`;
} else {
  shipment.textContent = 'This package could not be found in your order history.';
}
