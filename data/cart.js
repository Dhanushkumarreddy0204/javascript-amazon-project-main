import { getDeliveryOption } from './deliveryOptions.js';

export const orderPrefix = 'amazon-demo.order.';
export const maxQuantity = 999;

function newCartId() {
  return Array.from(crypto.getRandomValues(new Uint32Array(4)), n =>
    n.toString(16).padStart(8, '0')).join('');
}

function readCart() {
  const empty = { id: newCartId(), items: [] };
  const raw = sessionStorage.getItem('cart');
  if (!raw) return empty;

  let saved;
  try {
    saved = JSON.parse(raw);
  } catch {
    return empty;
  }
  // Earlier versions stored the item array directly.
  const rows = Array.isArray(saved) ? saved : saved?.items;
  if (!Array.isArray(rows)) return empty;
  const id = typeof saved.id === 'string' ? saved.id : empty.id;
  // A saved order consumes this revision even if navigation interrupted cleanup.
  if (localStorage.getItem(orderPrefix + id)) return empty;
  const items = rows.filter(row => typeof row?.productId === 'string'
    && Number.isInteger(row.quantity) && row.quantity > 0).map(row => ({
      productId: row.productId,
      quantity: Math.min(row.quantity, maxQuantity),
      deliveryOptionsId: getDeliveryOption(row.deliveryOptionsId).id
    }));
  return { id, items };
}

let state = readCart();
export let cart = state.items;

function save(items) {
  const next = { id: newCartId(), items };
  sessionStorage.setItem('cart', JSON.stringify(next));
  state = next;
  cart = items;
}

export function getCartId() {
  return state.id;
}

export function clearCart() {
  save([]);
}

export function calculateCartQuantity() {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

export function addToCart(productId, quantity = 1) {
  const item = cart.find(row => row.productId === productId);
  const total = (item?.quantity ?? 0) + quantity;
  if (!Number.isInteger(quantity) || quantity < 1 || total > maxQuantity) {
    throw new Error('You can add up to 999 of each product.');
  }
  if (item) {
    updateQuantity(productId, total);
  } else {
    save([...cart, { productId, quantity, deliveryOptionsId: '1' }]);
  }
}

export function updateQuantity(productId, quantity) {
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > maxQuantity) {
    throw new Error('Enter a whole number from 0 to 999.');
  }
  if (quantity === 0) {
    save(cart.filter(row => row.productId !== productId));
  } else {
    save(cart.map(row => row.productId === productId ? { ...row, quantity } : row));
  }
}

export function updateDeliveryOption(productId, optionId) {
  save(cart.map(row => row.productId === productId
    ? { ...row, deliveryOptionsId: getDeliveryOption(optionId).id } : row));
}

export function removeUnavailableProducts(getProduct) {
  const available = cart.filter(row => getProduct(row.productId));
  if (available.length !== cart.length) save(available);
}
