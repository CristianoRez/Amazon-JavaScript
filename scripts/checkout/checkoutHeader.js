import { calcCartQuantity } from "../../data/cart.js";

function renderCheckoutHeader() {
  let checkoutHTML = `Checkout (<a
      class="return-to-home-link js-checkout-quantity"
      href="amazon.html"
    >${calcCartQuantity() > 0 ? calcCartQuantity() + " items" : "0"}</a>)`;

  document.querySelector(".js-checkout-header-middle-section").innerHTML =
    checkoutHTML;
}

export default renderCheckoutHeader;
