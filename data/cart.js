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