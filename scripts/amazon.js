import { cart,addtocart } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatcurrency } from "./utils/money.js";

let productsHtml = '';

products.forEach((product) => {
    productsHtml += `
    <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>