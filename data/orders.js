import { cart, clearCart, getCartId, orderPrefix } from './cart.js';
import { getDeliveryOption, deliveryDate } from './deliveryOptions.js';
import { getProduct } from './products.js';

export function calculateTotals() {
  let itemsCents = 0;
  let shippingCents = 0;
  for (const item of cart) {
    itemsCents += getProduct(item.productId).priceCents * item.quantity;
    shippingCents += getDeliveryOption(item.deliveryOptionsId).priceCents;
  }
  const beforeTaxCents = itemsCents + shippingCents;
  const taxCents = Math.round(beforeTaxCents / 10);
  return { itemsCents, shippingCents, beforeTaxCents, taxCents, totalCents: beforeTaxCents + taxCents };
}

export function getOrder(id) {
  const raw = localStorage.getItem(orderPrefix + id);
  if (!raw) return null;
  try {
    const order = JSON.parse(raw);
    return order?.id === id && Array.isArray(order.items) ? order : null;
  } catch {
    return null;
  }
}

export function listOrders() {
  const orders = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(orderPrefix)) continue;
    const order = getOrder(key.slice(orderPrefix.length));
    if (order) orders.push(order);
  }
  return orders.sort((a, b) => b.placedAt.localeCompare(a.placedAt));
}

export function placeOrder() {
  if (!cart.length) throw new Error('Your cart is empty.');
  const id = getCartId();
  if (!getOrder(id)) {
    const placedAt = new Date();
    const items = cart.map(item => {
      const { name, image, priceCents } = getProduct(item.productId);
      const option = getDeliveryOption(item.deliveryOptionsId);
      return { ...item, name, image, priceCents, shippingCents: option.priceCents,
        arrivesAt: deliveryDate(option, placedAt).toISOString() };
    });
    const order = { id, placedAt: placedAt.toISOString(), ...calculateTotals(), items };
    localStorage.setItem(orderPrefix + id, JSON.stringify(order));
  }
  clearCart();
  return id;
}
