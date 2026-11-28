import { cart, calculateCartQuantity } from '../../data/cart.js';
import { calculateTotals, placeOrder } from '../../data/orders.js';
import { formatCurrency } from '../utils/money.js';
import { showCartError } from '../shared.js';

export function renderPaymentSummary() {
  const summary = document.querySelector('.js-payment-summary');
  const totals = calculateTotals();
  const rows = [
    [`Items (${calculateCartQuantity()})`, totals.itemsCents, ''],
    ['Shipping &amp; handling', totals.shippingCents, ''],
    ['Total before tax', totals.beforeTaxCents, 'subtotal-row'],
    ['Estimated tax (10%)', totals.taxCents, ''],
    ['Order total', totals.totalCents, 'total-row']
  ];
  summary.hidden = false;
  summary.innerHTML = `<div class="payment-summary-title">Order Summary</div>
    ${rows.map(([label, cents, style]) => `<div class="payment-summary-row ${style}">
      <div>${label}</div><div class="payment-summary-money">$${formatCurrency(cents)}</div>
    </div>`).join('')}
    <button class="place-order-button button-primary" ${cart.length ? '' : 'disabled'}>Place your order</button>`;

  const button = summary.querySelector('button');
  button.onclick = () => {
    if (button.disabled) return;
    button.disabled = true;
    try {
      placeOrder();
      location.assign('orders.html');
    } catch (error) {
      button.disabled = false;
      showCartError(error);
    }
  };
}
