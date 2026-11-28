import { calculateCartQuantity, removeUnavailableProducts } from '../data/cart.js';
import { loadProducts, getProduct } from '../data/products.js';
import { renderOrderSummary } from './checkout/ordersummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import { showCatalogError } from './shared.js';

function renderCheckout() {
  const quantity = calculateCartQuantity();
  document.querySelector('.js-return-to-homepage').textContent =
    `${quantity} ${quantity === 1 ? 'item' : 'items'}`;
  renderOrderSummary(renderCheckout);
  renderPaymentSummary();
}

loadProducts().then(() => {
  removeUnavailableProducts(getProduct);
  renderCheckout();
}).catch(showCatalogError);
