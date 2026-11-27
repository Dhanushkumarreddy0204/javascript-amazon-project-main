import { getProduct } from './products.js';
import { deliveryOptions } from './deliveryOptions.js';

const key = 'amazon-shop-v1';

export function readShop() {
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved);
  const legacy = JSON.parse(localStorage.getItem('cart') || '[]');
  const cart = legacy.filter(item => getProduct(item.productId) &&
    Number.isInteger(item.quantity) && item.quantity > 0).map(item => ({
    ...item,
    deliveryOptionsId: deliveryOptions.some(option => option.id === item.deliveryOptionsId)
      ? item.deliveryOptionsId : '1'
  }));
  return { cart, orders: [] };
}

// Commit cart and order history in one write, using the latest state from other tabs.
export async function changeShop(change) {
  function commit() {
    const shop = readShop();
    const result = change(shop);
    localStorage.setItem(key, JSON.stringify(shop));
    return result;
  }
  return navigator.locks ? navigator.locks.request(key, commit) : commit();
}

export function addToCart(productId, quantity = 1) {
  return changeShop(shop => {
    const item = shop.cart.find(line => line.productId === productId);
    if (!getProduct(productId) || !Number.isInteger(quantity) || quantity < 1 ||
        quantity + (item?.quantity || 0) > 999) {
      throw new Error('Choose a quantity that keeps this item between 1 and 999.');
    }
    if (item) item.quantity += quantity;
    else shop.cart.push({ productId, quantity, deliveryOptionsId: '1' });
  });
}

export function displayCount() {
  document.querySelector('.cart-quantity').textContent =
    readShop().cart.reduce((sum, item) => sum + item.quantity, 0);
}

function refreshBadge() {
  if (document.querySelector('.cart-quantity')) displayCount();
}
window.addEventListener('pageshow', refreshBadge);
window.addEventListener('storage', refreshBadge);
