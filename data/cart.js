export let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addtocart(productId) {
  let matchingItem;
  cart.forEach((cartitem) => {
    if (productId === cartitem.productId) {
      matchingItem = cartitem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({
      productId: productId, // Ensure consistency with checkout.js
      quantity: 1
    });
  }
  saveToStorage();
}

export function removefromcart(productId) {
  const newcart = cart.filter(cartitem => cartitem.productId !== productId);
  cart = newcart;
  saveToStorage();
}
