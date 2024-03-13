import {
  cart,
  removeFromCart,
  updateCartQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import {
  deliveryOptionsData,
  getDeliveryOption,
  calculateDeliveryDate,
} from "../../data/deliveryOptionsData.js";
import { formatCurrency } from "../utils/money.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import renderCheckoutHeader from "./checkoutHeader.js";

export function renderOrderSummary() {
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);

    let deliveryDate;
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    deliveryDate = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container js-cart-item-${
        matchingProduct.id
      }">
        <div class="delivery-date">
        ${deliveryDate}
        </div>
  
        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">
          <div class="cart-item-details">
            <div class="product-name js-product-name-${productId}">
              ${matchingProduct.name};
            </div>
            <div class="product-price js-product-price-${matchingProduct.id}">
              $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity js-product-quantity-${
              matchingProduct.id
            }">
              <span>
                Quantity: <span class="quantity-label js-quantity-label">
                ${cartItem.quantity}
              </span>
              <span class="update-quantity-link link-primary js-update-link" data-product-id="${
                matchingProduct.id
              }">
                Update
              </span>
              <input class='quantity-input js-quantity-input'>
              <span class='save-link js-save-link link-primary' data-product-id='${
                matchingProduct.id
              }'>
                Save
              </span>
              <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${
                matchingProduct.id
              }" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>
          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct.id, cartItem)}
          </div>
        </div>
      </div>
      `;
  });

  function deliveryOptionsHTML(productId, cartItem) {
    let html = "";
    deliveryOptionsData.forEach((delivery) => {
      const isChecked = cartItem.deliveryOptionId === delivery.id;
      let deliveryDate;
      deliveryDate = calculateDeliveryDate(delivery);
      const priceString =
        delivery.priceCents === 0
          ? "FREE "
          : `$${(delivery.priceCents / 100).toFixed(2)} -`;
      html += `
            <div class="delivery-option js-delivery-option js-delivery-${productId}-${
        delivery.id
      }" data-product-id="${productId}" data-delivery-option-id="${
        delivery.id
      }">
              <input type="radio"
              ${isChecked ? "checked" : ""} 
              class="delivery-option-input js-delivery-option-input js-input-${delivery.id}" name="${productId}">
              <div>
                <div class="delivery-option-date">
                  ${deliveryDate}
                </div>
                <div class="delivery-option-price">
                  ${priceString} Shipping
                </div
              </div>
            </div>
          </div>
        `;
    });
    return html;
  }
  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      let productId = link.dataset.productId;
      removeFromCart(productId);
      renderPaymentSummary();
      renderOrderSummary();
      renderCheckoutHeader();
    });
  });

  document.querySelectorAll(".js-update-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      document
        .querySelector(`.js-cart-item-${productId}`)
        .classList.add("is-editing-quantity");
      document
        .querySelector(`.js-cart-item-${productId}`)
        .querySelector(".js-quantity-input")
        .select();
    });
  });
  document.querySelectorAll(`.js-save-link`).forEach((link) => {
    const productId = link.dataset.productId;
    link.addEventListener("click", () => {
      const newQuantity = Number(
        document
          .querySelector(`.js-cart-item-${productId}`)
          .querySelector(".js-quantity-input").value
      );
      DOMCartQuantity(productId, newQuantity);
      renderPaymentSummary();
      renderCheckoutHeader();
    });
    document
      .querySelector(`.js-cart-item-${productId}`)
      .querySelector(".js-quantity-input")
      .addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          const newQuantity = Number(
            document
              .querySelector(`.js-cart-item-${productId}`)
              .querySelector(".js-quantity-input").value
          );
          DOMCartQuantity(productId, newQuantity);
        }
        renderPaymentSummary();
        renderCheckoutHeader();
      });
  });

  function DOMCartQuantity(productId, newQuantity) {
    document
      .querySelector(`.js-cart-item-${productId}`)
      .querySelector(".js-quantity-label").innerHTML = updateCartQuantity(
      productId,
      newQuantity
    );
    document
      .querySelector(`.js-cart-item-${productId}`)
      .classList.remove("is-editing-quantity");
  }

  //Set delivery time

  document.querySelectorAll(`.js-delivery-option`).forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}

renderCheckoutHeader();
