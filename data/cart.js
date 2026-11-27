// Use sessionStorage so the cart persists on refresh but clears on new tab/window
export let cart = JSON.parse(sessionStorage.getItem("cart")) || [];



function saveToStorage() {
  sessionStorage.setItem("cart", JSON.stringify(cart));
}


export function addToCart(productId, quantity = 1) {
  let matchingItem = cart.find((cartItem) => cartItem.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionsId: '1',
    });
  }
  saveToStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  return cartQuantity;
}


export function removeFromCart(productId) {
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
