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
