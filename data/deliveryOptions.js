export const deliveryOptions = [
  { id: '1', deliveryDays: 7, priceCents: 0 },
  { id: '2', deliveryDays: 3, priceCents: 499 },
  { id: '3', deliveryDays: 1, priceCents: 999 }
];

export function getDeliveryOption(id) {
  return deliveryOptions.find(option => option.id === id) ?? deliveryOptions[0];
}

export function deliveryDate(option, from = new Date()) {
  const date = new Date(from);
  date.setDate(date.getDate() + option.deliveryDays);
  return date;
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });
}
