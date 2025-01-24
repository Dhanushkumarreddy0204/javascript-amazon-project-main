import { cart, removefromcart, updateQuantity, updateDeliveryOption } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { formatcurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";

dayjs();

const today = dayjs();

export function renderOrderSummary() {
  let cartSummaryHtml = '';
  let totalPrice = 0;
  let totalShipping = 0;

cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct = products.find((product) => product.id === productId);

    if (!matchingProduct) {
      console.warn(`Product with ID ${productId} not found in products array.`);
      return; 
    }

    const deliveryOptionsId = cartItem.deliveryOptionsId;

    let deliveryOption;
    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionsId) {
        deliveryOption = option;
      }
    });

    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    const productTotal = matchingProduct.priceCents * cartItem.quantity;
    totalPrice += productTotal;
    totalShipping += deliveryOption.priceCents;

    cartSummaryHtml += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: <span class="js-delivery-date-${matchingProduct.id}">${dateString}</span>
        </div>
        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">
          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${formatcurrency(matchingProduct.priceCents)} x ${cartItem.quantity}
            </div>
            <div class="product-total">
              Total: $${formatcurrency(productTotal)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input 
                class="quantity-input js-quantity-input-${matchingProduct.id}" 
                type="number" 
                value="${cartItem.quantity}" 
                min="0" 
                max="999" 
              />
              <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">Save</span>
              <span class="delete-quantity-link js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });
  document.querySelector('.js-order-summary').innerHTML = cartSummaryHtml;

 
  renderPaymentSummary(totalPrice, totalShipping);

  addEventListeners();
}
function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = '';
  deliveryOptions.forEach((deliveryOption) => {
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    const priceString = deliveryOption.priceCents === 0 ? 'Free' : `$${formatcurrency(deliveryOption.priceCents)} - `;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionsId;
    html += `
      <div class="delivery-option">
        <input 
          type="radio"
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}"
          value="${deliveryOption.id}"
          data-product-id="${matchingProduct.id}"
          ${isChecked ? 'checked' : ''} 
        />
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>`;
  });
  return html;
}

function addEventListeners() {
  
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removefromcart(productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      if (container) {
        container.remove();
      }

      updateCartQuantity();
    });
  });

  
  document.querySelectorAll('.delivery-option-input').forEach((input) => {
    input.addEventListener('change', (event) => {
      const selectedDeliveryOptionId = event.target.value; 
      const productId = event.target.dataset.productId; 

      updateDeliveryOption(productId, selectedDeliveryOptionId); 

      
      const selectedOption = deliveryOptions.find(option => option.id === selectedDeliveryOptionId);
      const deliveryDate = today.add(selectedOption.deliveryDays, 'days');
      const dateString = deliveryDate.format('dddd, MMMM D');
      const deliveryDateElement = document.querySelector(`.js-delivery-date-${productId}`);

      if (deliveryDateElement) {
        deliveryDateElement.textContent = dateString;
      }
    });
  });

  
  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      if (container) {
        container.classList.add('is-editing-quantity');
      }
    });
  });

  
  document.querySelectorAll('.js-save-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;

      const quantityInput = document.querySelector(
        `.js-quantity-input-${productId}`
      );
      if (!quantityInput) {
        console.error(`Quantity input for product ID ${productId} not found.`);
        return;
      }

      const newQuantity = parseInt(quantityInput.value, 10) || 0; 

      if (newQuantity < 0 || newQuantity >= 1000) {
        alert('Quantity must be at least 0 and less than 1000');
        return;
      }
      updateQuantity(productId, newQuantity);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      if (container) {
        container.classList.remove('is-editing-quantity');
      }
      const quantityLabel = document.querySelector(
        `.js-quantity-label-${productId}`
      );
      if (quantityLabel) {
        quantityLabel.innerHTML = newQuantity;
      }

      updateCartQuantity();
    });
  });
}


