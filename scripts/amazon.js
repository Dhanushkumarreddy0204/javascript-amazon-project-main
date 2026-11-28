import { addToCart } from '../data/cart.js';
import { products, loadProducts } from '../data/products.js';
import { updateCartBadge, showMessage, showCatalogError, showCartError } from './shared.js';

const query = (new URLSearchParams(location.search).get('q') ?? '').trim();
document.querySelector('.search-bar').value = query;
updateCartBadge();
loadProducts().then(renderProductsGrid).catch(showCatalogError);

function renderProductsGrid() {
  const terms = query.toLowerCase().split(/\s+/);
  const matches = products.filter(product => {
    const searchable = [product.name, ...product.keywords].join(' ').toLowerCase();
    return terms.every(term => searchable.includes(term));
  });
  const grid = document.querySelector('.js-products-grid');
  if (!matches.length) {
    showMessage(`No products match “${query}”. `);
    const reset = document.createElement('a');
    reset.href = 'amazon.html';
    reset.textContent = 'View all products';
    document.querySelector('.shop-message').append(reset);
    return;
  }
  grid.innerHTML = matches.map(product => `
    <article class="product-container">
      <div class="product-image-container"><img class="product-image" src="${product.image}" alt=""></div>
      <div class="product-name limit-text-to-2-lines">${product.name}</div>
      <div class="product-rating-container">
        <img class="product-rating-stars" src="${product.getStarsUrl()}" alt="${product.rating.stars} out of 5 stars">
        <span class="product-rating-count">${product.rating.count}</span>
      </div>
      <div class="product-price">${product.getPrice()}</div>
      <div class="product-quantity-container">
        <select aria-label="Quantity for ${product.name.replaceAll('"', '&quot;')}">
          ${Array.from({ length: 10 }, (_, i) => `<option>${i + 1}</option>`).join('')}
        </select>
        ${product.sizeChartLink ? `<a class="link-primary" href="${product.sizeChartLink}" target="_blank" rel="noopener">Size chart</a>` : ''}
      </div>
      <div class="product-spacer"></div>
      <div class="added-to-cart" aria-hidden="true"><img src="images/icons/checkmark.png" alt="">Added</div>
      <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">Add to Cart</button>
    </article>`).join('');

  grid.querySelectorAll('.js-add-to-cart').forEach(button => {
    const card = button.closest('.product-container');
    const message = card.querySelector('.added-to-cart');
    let timer;
    button.addEventListener('click', () => {
      try {
        addToCart(button.dataset.productId, Number(card.querySelector('select').value));
        updateCartBadge();
        showMessage('');
        message.classList.add('added-to-cart-visible');
        clearTimeout(timer);
        timer = setTimeout(() => message.classList.remove('added-to-cart-visible'), 2000);
      } catch (error) {
        showCartError(error);
      }
    });
  });
}
