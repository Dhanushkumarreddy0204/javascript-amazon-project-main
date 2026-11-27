import { getProduct } from './products.js';
import { deliveryOptions } from './deliveryOptions.js';

export function quote(cart, now = new Date()) {
  let subtotal = 0;
  let shipping = 0;
  let quantity = 0;
  const items = cart.map(line => {
    const product = getProduct(line.productId);
    const option = deliveryOptions.find(entry => entry.id === line.deliveryOptionsId);
    const arrival = new Date(now);
    arrival.setDate(arrival.getDate() + option.deliveryDays);
    subtotal += product.priceCents * line.quantity;
    shipping += option.priceCents;
    quantity += line.quantity;
    return { ...line, priceCents: product.priceCents, shippingCents: option.priceCents,
      arrival: arrival.toISOString() };
  });
  const beforeTax = subtotal + shipping;
  const tax = Math.round(beforeTax / 10);
  return { items, quantity, subtotal, shipping, beforeTax, tax, total: beforeTax + tax };
}

export function displayDate(date) {
  return new Date(date).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
}
