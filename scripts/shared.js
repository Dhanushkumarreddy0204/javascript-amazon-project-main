import { calculateCartQuantity } from '../data/cart.js';

export function updateCartBadge() {
  const badge = document.querySelector('.js-cart-quantity');
  if (badge) badge.textContent = calculateCartQuantity();
}

export function showMessage(message) {
  const status = document.querySelector('.shop-message');
  status.textContent = message;
  status.hidden = !message;
}

export function showCatalogError() {
  showMessage('The product catalog could not be loaded. ');
  const retry = document.createElement('a');
  retry.href = location.href;
  retry.textContent = 'Try again';
  document.querySelector('.shop-message').append(retry);
}

export function showCartError(error) {
  showMessage(error instanceof DOMException
    ? 'Your browser could not save this change. Check available storage and try again.'
    : error.message);
}

window.addEventListener('pageshow', event => {
  if (event.persisted) location.reload();
});
