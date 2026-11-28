import { formatCurrency } from '../scripts/utils/money.js';

export let products = [];

export function getProduct(id) {
  return products.find(product => product.id === id);
}

export async function loadProducts() {
  const response = await fetch(new URL('../backend/products.json', import.meta.url));
  if (!response.ok) throw new Error('The product catalog could not be loaded.');
  const data = await response.json();
  products = data.map(details => new Product(details));
}

class Product {
  constructor(details) {
    this.id = details.id;
    this.name = details.name;
    this.image = details.image;
    this.priceCents = details.priceCents;
    this.rating = details.rating;
    this.keywords = details.keywords ?? [];
    this.sizeChartLink = details.sizeChartLink;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }
}
