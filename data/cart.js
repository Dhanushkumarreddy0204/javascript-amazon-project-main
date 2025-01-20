export let cart = JSON.parse(localStorage.getItem("cart")) || [];



function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}


export function addtocart(productId, deliveryOptionsId = '1') {
  let matchingItem = cart.find((cartItem) => cartItem.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += 1; 
    matchingItem.deliveryOptionsId = deliveryOptionsId; 
  } else {
    cart.push({
      productId: productId,
      quantity: 1,
      deliveryOptionsId: deliveryOptionsId, 
    });
  }
  saveToStorage();
}


export function removefromcart(productId) {
  cart = cart.filter((cartItem) => cartItem.productId !== productId); 
  saveToStorage();
}


export function updateQuantity(productId, newQuantity) {
  let matchingItem = cart.find((cartItem) => cartItem.productId === productId);

  if (matchingItem) {
    if (newQuantity <= 0) {
      
      cart = cart.filter((cartItem) => cartItem.productId !== productId);
    } else {
      matchingItem.quantity = newQuantity; 
    }
    saveToStorage();
  } else {
    console.warn(`Item with product ID ${productId} not found in the cart.`);
  }
}


export function updateDeliveryOption(productId, deliveryOptionsId) {
  let matchingItem = cart.find((cartItem) => cartItem.productId === productId);

  if (matchingItem) {
    matchingItem.deliveryOptionsId = deliveryOptionsId; 
    saveToStorage();
  } else {
    console.warn(`Item with product ID ${productId} not found in the cart.`);
  }
}


saveToStorage();
