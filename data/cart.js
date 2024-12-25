export let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save the cart to localStorage
function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add an item to the cart
export function addtocart(productId) {
  let matchingItem = cart.find(cartItem => cartItem.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += 1; // Increment quantity if the item already exists
  } else {
    cart.push({
      productId: productId,
      quantity: 1
    });
  }
  saveToStorage();
}

// Remove an item from the cart
export function removefromcart(productId) {
  cart = cart.filter(cartItem => cartItem.productId !== productId); // Filter out the item
  saveToStorage();
}

// Update the quantity of an item in the cart
export function updateQuantity(productId, newQuantity) {
  let matchingItem = cart.find(cartItem => cartItem.productId === productId);

  if (matchingItem) {
    if (newQuantity <= 0) {
      // Remove the item if quantity is less than or equal to 0
      cart = cart.filter(cartItem => cartItem.productId !== productId);
    } else {
      matchingItem.quantity = newQuantity; // Update the quantity
    }
    saveToStorage();
  } else {
    console.warn(`Item with product ID ${productId} not found in the cart.`);
  }
}