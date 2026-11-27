import { readShop, changeShop } from '../data/cart.js';
import { quote, displayDate } from '../data/orders.js';
import { getProduct } from '../data/products.js';
import { deliveryOptions } from '../data/deliveryOptions.js';
import { formatcurrency } from './utils/money.js';

const lines = document.querySelector('.order-summary');
const summary = document.querySelector('.payment-summary');
let displayedCart;
const money = cents => '$' + formatcurrency(cents);

function renderItem(line, today) {
  const product = getProduct(line.productId);
  const options = deliveryOptions.map(option => {
    const arrival = new Date(today);
    arrival.setDate(arrival.getDate() + option.deliveryDays);
    return `<label class="delivery-option">
      <input class="delivery-option-input" type="radio" name="shipping-${product.id}"
        value="${option.id}" ${option.id === line.deliveryOptionsId ? 'checked' : ''}>
      <span><span class="delivery-option-date">${displayDate(arrival)}</span><br>
      <span class="delivery-option-price">${option.priceCents ? money(option.priceCents) : 'Free'} shipping</span></span>
    </label>`;
  }).join('');
  return `<section class="cart-item-container" data-id="${product.id}">
    <div class="delivery-date">Delivery date: ${displayDate(line.arrival)}</div>
    <div class="cart-item-details-grid">
      <img class="product-image" src="${product.image}" alt="">
      <div><div class="product-name">${product.name}</div>
        <div class="product-price">${money(line.priceCents)} each</div>
        <div>Total: ${money(line.priceCents * line.quantity)}</div>
        <form class="product-quantity">Quantity: <span class="quantity-label">${line.quantity}</span>
          <input class="quantity-input" aria-label="Quantity" type="number" required min="0" max="999" step="1" value="${line.quantity}">
          <button type="button" class="update-quantity-link link-primary">Update</button>
          <button class="save-quantity-link link-primary">Save</button>
          <button type="button" class="delete-quantity-link link-primary">Delete</button>
        </form>
      </div>
      <div><div class="delivery-options-title">Choose a delivery option</div>${options}</div>
    </div>
  </section>`;
}

function render() {
  const cart = readShop().cart;
  displayedCart = JSON.stringify(cart);
  const today = new Date();
  const bill = quote(cart, today);
  document.querySelector('.return-to-home-link').textContent =
    bill.quantity + (bill.quantity === 1 ? ' item' : ' items');
  lines.innerHTML = bill.items.map(line => renderItem(line, today)).join('') ||
    '<p>Your cart is empty. <a href="amazon.html">Browse products</a></p>';
  const rows = [
    [`Items (${bill.quantity})`, bill.subtotal], ['Shipping & handling', bill.shipping],
    ['Total before tax', bill.beforeTax, 'subtotal-row'], ['Estimated tax (10%)', bill.tax],
    ['Order total', bill.total, 'total-row']
  ];
  summary.innerHTML = '<div class="payment-summary-title">Order Summary</div>' +
    rows.map(([label, amount, css = '']) => `<div class="payment-summary-row ${css}">
      <div>${label}</div><div class="payment-summary-money">${money(amount)}</div></div>`).join('') +
    `<button class="place-order-button button-primary" ${bill.quantity ? '' : 'disabled'}>Place your order</button>`;
}

async function edit(target, change) {
  const id = target.closest('[data-id]').dataset.id;
  try {
    await changeShop(shop => {
      const item = shop.cart.find(line => line.productId === id);
      if (item) change(shop, item);
    });
  } catch (error) { alert(error.message); }
  render();
}

lines.addEventListener('change', event => {
  if (event.target.matches('.delivery-option-input')) {
    const option = event.target.value;
    edit(event.target, (_, item) => { item.deliveryOptionsId = option; });
  }
});

function setQuantity(target, quantity) {
  return edit(target, (shop, item) => {
    if (quantity === 0) shop.cart = shop.cart.filter(line => line !== item);
    else item.quantity = quantity;
  });
}

lines.addEventListener('click', event => {
  if (event.target.matches('.update-quantity-link')) {
    event.target.form.classList.add('is-editing-quantity');
    event.target.form.querySelector('input').focus();
  }
  if (event.target.matches('.delete-quantity-link')) setQuantity(event.target, 0);
});
lines.addEventListener('submit', event => {
  event.preventDefault();
  setQuantity(event.target, event.target.querySelector('input').valueAsNumber);
});
summary.addEventListener('click', async event => {
  if (!event.target.matches('.place-order-button')) return;
  event.target.disabled = true;
  const expectedCart = displayedCart;
  try {
    await changeShop(shop => {
      if (!shop.cart.length || JSON.stringify(shop.cart) !== expectedCart) {
        throw new Error('Your cart changed. Review the updated total before ordering.');
      }
      const now = new Date();
      shop.orders.unshift({ id: crypto.randomUUID(), placed: now.toISOString(), ...quote(shop.cart, now) });
      shop.cart = [];
    });
    location.assign('orders.html');
  } catch (error) {
    render();
    alert(error.message);
  }
});
window.addEventListener('storage', render);
window.addEventListener('pageshow', render);
render();
