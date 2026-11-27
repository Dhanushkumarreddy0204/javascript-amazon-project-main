import { addToCart, displayCount } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatcurrency } from "./utils/money.js";

let productsHtml = '';

const query = (new URLSearchParams(location.search).get('q') || '').trim();
document.querySelector('.search-bar').value = query;
const matches = products.filter(product =>
  [product.name, ...product.keywords].join(' ').toLowerCase().includes(query.toLowerCase())
);
matches.forEach((product) => {
    productsHtml += `
    <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars*10}.png">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            $${formatcurrency(product.priceCents)}
          </div>

          <div class="product-quantity-container">
            <select>
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart"
          data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>`;
});

document.querySelector('.js-products-grid').innerHTML = productsHtml || '<p>No matching products. <a href="amazon.html">View all products</a></p>';
displayCount();

document.querySelectorAll('.js-add-to-cart').forEach(button => {
  button.addEventListener('click', async () => {
    const card = button.closest('.product-container');
    try {
      await addToCart(button.dataset.productId, Number(card.querySelector('select').value));
      displayCount();
      card.querySelector('.added-to-cart').style.opacity = 1;
    } catch (error) {
      alert(error.message);
    }
  });
});
