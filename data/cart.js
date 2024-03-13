import { getDeliveryOption } from "./deliveryOptionsData.js";
import { getProduct } from "./products.js";

export let cart;
loadFromStorage();
export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem("cart"));
  if (!cart) {
    cart = [];
  }
}

export function addToCart(productId, quantity) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  if (matchingItem) {
    if (quantity) {
      if (matchingItem.quantity + quantity > 10) {
        window.alert("Max of 10 items!");
        matchingItem.quantity = 10;
        saveToStorage(cart);
      } else {
        matchingItem.quantity += quantity;
        saveToStorage(cart);
      }
    } else {
      matchingItem.quantity += 1;
      saveToStorage(cart);
    }
  } else {
    if (quantity) {
      cart.push({
        productId: productId,
        quantity: quantity,
        deliveryOptionId: 1,
      });
    } else {
      cart.push({
        productId: productId,
        quantity: 1,
        deliveryOptionId: 1,
      });
    }
    saveToStorage(cart);
  }
}

export function removeFromCart(productId) {
  let newCart = [];
  cart.forEach((product) => {
    if (product.productId !== productId) {
      newCart.push(product);
    }
    cart = newCart;
  });
  saveToStorage(cart);
}

function saveToStorage(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function calcCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  if (cartQuantity === 0) {
    cartQuantity = "";
  }
  return cartQuantity;
}

export function updateCartQuantity(productId, quantity) {
  let newQuantity;
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      if (quantity <= 10) {
        cartItem.quantity = quantity;
        newQuantity = quantity;
      } else {
        window.alert("Max of 10 items");
        cartItem.quantity = 10;
        newQuantity = 10;
      }
    }
    saveToStorage(cart);
  });
  return newQuantity;
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;
  console.log(deliveryOptionId)
  console.log(getDeliveryOption(deliveryOptionId));
  const matchingDelivery = getDeliveryOption(deliveryOptionId);
  if (!matchingDelivery) {
    return;
  }
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
      matchingItem.deliveryOptionId = Number(deliveryOptionId);
      saveToStorage(cart);
    } else {
      return;
    }
  });
}

export function ItemsTotalPrice() {
  let productsPriceCents = 0;
  let deliveryOptionPriceCents = 0;
  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productsPriceCents += product.priceCents * cartItem.quantity;
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    deliveryOptionPriceCents += deliveryOption.priceCents;
  });
  const totalBeforeTax = productsPriceCents + deliveryOptionPriceCents;
  const tax = totalBeforeTax * 0.1;
  const total = totalBeforeTax + tax;
  return {
    productsPriceCents,
    deliveryOptionPriceCents,
    totalBeforeTax,
    tax,
    total,
  };
}
