import { ItemsTotalPrice, calcCartQuantity } from "../../data/cart.js";
import { formatCurrency } from "../utils/money.js";

export function renderPaymentSummary() {
  document.querySelector(
    ".js-payment-summary"
  ).innerHTML = `<div class="payment-summary-title">Order Summary</div>

    <div class="payment-summary-row">
      <div>Items (${calcCartQuantity()}):</div>
      <div class="payment-summary-money">$${formatCurrency(ItemsTotalPrice().productsPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money js-shipping-price">$${formatCurrency(ItemsTotalPrice().deliveryOptionPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(ItemsTotalPrice().totalBeforeTax)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(ItemsTotalPrice().tax)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money js-total-price">$${formatCurrency(ItemsTotalPrice().total)}</div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>`;
}
