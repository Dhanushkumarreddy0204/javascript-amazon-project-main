import { cart, updateQuantity, updateDeliveryOption, maxQuantity } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { deliveryOptions, getDeliveryOption, deliveryDate, formatDate } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';
import { showCartError, showMessage } from '../shared.js';

function optionHTML(option, item, today) {
  const price = option.priceCents ? `$${formatCurrency(option.priceCents)} shipping` : 'Free shipping';
  return `<label class="delivery-option">
    <input type="radio" class="delivery-option-input" name="shipping-${item.productId}"
      value="${option.id}" ${option.id === item.deliveryOptionsId ? 'checked' : ''}>
    <span><span class="delivery-option-date">${formatDate(deliveryDate(option, today))}</span>
    <span class="delivery-option-price">${price}</span></span>
  </label>`;
}

export function renderOrderSummary(refresh) {
  const summary = document.querySelector('.js-order-summary');
  if (!cart.length) {
    summary.innerHTML = '<p>Your cart is empty. <a class="link-primary" href="amazon.html">Browse products</a></p>';
    return;
  }
  const today = new Date();
  summary.innerHTML = cart.map(item => {
    const product = getProduct(item.productId);
    const option = getDeliveryOption(item.deliveryOptionsId);
    return `<article class="cart-item-container" data-product-id="${product.id}">
      <div class="delivery-date">Delivery date: ${formatDate(deliveryDate(option, today))}</div>
      <div class="cart-item-details-grid">
        <img class="product-image" src="${product.image}" alt="">
        <div class="cart-item-details">
          <div class="product-name">${product.name}</div>
          <div class="product-price">${product.getPrice()} × ${item.quantity}</div>
          <div class="product-total">Total: $${formatCurrency(product.priceCents * item.quantity)}</div>
          <form class="product-quantity">
            Quantity: <span class="quantity-label">${item.quantity}</span>
            <button type="button" class="update-quantity-link link-primary">Update</button>
            <input class="quantity-input" aria-label="New quantity" type="number" min="0"
              max="${maxQuantity}" step="1" value="${item.quantity}" required>
            <button type="submit" class="save-quantity-link link-primary">Save</button>
            <button type="button" class="delete-quantity-link link-primary">Delete</button>
          </form>
        </div>
        <div class="delivery-options">
          <div class="delivery-options-title">Choose a delivery option</div>
          ${deliveryOptions.map(o => optionHTML(o, item, today)).join('')}
        </div>
      </div>
    </article>`;
  }).join('');

  function changeCart(change) {
    try {
      change();
      showMessage('');
      refresh();
    } catch (error) {
      showCartError(error);
    }
  }

  summary.querySelectorAll('.cart-item-container').forEach(row => {
    const id = row.dataset.productId;
    const input = row.querySelector('.quantity-input');
    row.querySelector('.update-quantity-link').onclick = () => {
      row.classList.add('is-editing-quantity');
      input.focus();
      input.select();
    };
    row.querySelector('form').onsubmit = event => {
      event.preventDefault();
      changeCart(() => updateQuantity(id, input.valueAsNumber));
    };
    row.querySelector('.delete-quantity-link').onclick = () => changeCart(() => updateQuantity(id, 0));
    row.querySelector('.delivery-options').onchange = event => {
      changeCart(() => updateDeliveryOption(id, event.target.value));
    };
  });
}
