import { getOrder } from '../data/orders.js';
import { formatDate } from '../data/deliveryOptions.js';
import { updateCartBadge, showMessage } from './shared.js';

updateCartBadge();
const params = new URLSearchParams(location.search);
const order = getOrder(params.get('orderId'));
const item = order?.items.find(row => row.productId === params.get('productId'));

if (!item) {
  showMessage('This package could not be found. Choose a package from Your Orders.');
} else {
  const panel = document.querySelector('.order-tracking');
  panel.querySelector('.product-name').textContent = item.name;
  panel.querySelector('.product-quantity').textContent = 'Quantity: ' + item.quantity;
  panel.querySelector('img').src = item.image;
  const start = Date.parse(order.placedAt);
  const end = Date.parse(item.arrivesAt);

  function renderProgress() {
    const now = Date.now();
    const stage = now >= end ? 2 : now >= start + (end - start) / 2 ? 1 : 0;
    panel.querySelector('.delivery-date').textContent =
      (stage === 2 ? 'Delivered on ' : 'Arriving on ') + formatDate(item.arrivesAt);
    panel.querySelectorAll('.progress-label').forEach((label, i) => {
      label.classList.toggle('current-status', i === stage);
      if (i === stage) label.setAttribute('aria-current', 'step');
      else label.removeAttribute('aria-current');
    });
    panel.querySelector('.progress-bar').style.width = ['8%', '50%', '100%'][stage];
  }

  renderProgress();
  panel.hidden = false;
  const timer = setInterval(renderProgress, 60000);
  window.addEventListener('pagehide', () => clearInterval(timer), { once: true });
}
