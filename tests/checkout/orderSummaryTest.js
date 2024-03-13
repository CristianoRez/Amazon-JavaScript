import { renderOrderSummary } from "../../scripts/checkout/orderSummary.js";
import { loadFromStorage, cart } from "../../data/cart.js";
import { products } from "../../data/products.js";

describe("test suite: renderOrderSummary", () => {
  const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  const productId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";

  beforeEach(() => {
    spyOn(localStorage, "setItem");
    document.querySelector(".js-test-container").innerHTML = `
    <div class="js-order-summary"></div>
    <div class="js-payment-summary"></div>
      `;

    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        {
          productId: productId1,
          quantity: 2,
          deliveryOptionId: 1,
        },
        {
          productId: productId2,
          quantity: 1,
          deliveryOptionId: 2,
        },
      ]);
    });
    loadFromStorage();
    renderOrderSummary();
  });

  afterEach(() => {
    document.querySelector(`.js-test-container`).innerHTML = "";
    document.querySelector(`.js-checkout-header-middle-section`).innerHTML = "";
  });

  it("display the cart", () => {
    expect(document.querySelectorAll(".js-cart-item-container").length).toEqual(
      2
    );

    expect(
      document.querySelector(`.js-product-quantity-${productId2}`).innerText
    ).toContain(`Quantity: 1`);
  });

  it("Delete a product", () => {
    document.querySelector(`.js-delete-link-${productId1}`).click();
    expect(document.querySelectorAll(".js-cart-item-container").length).toEqual(
      1
    );
    expect(document.querySelector(`.js-cart-item-${productId1}`)).toEqual(null);
    expect(document.querySelector(`.js-cart-item-${productId2}`)).not.toEqual(
      null
    );

    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productId2);
  });

  it("Correct products name", () => {
    expect(
      document.querySelector(`.js-product-name-${productId1}`).innerText
    ).toContain("Black and Gray Athletic Cotton Socks - 6 Pairs");
    expect(
      document.querySelector(`.js-product-name-${productId2}`).innerText
    ).toContain("Intermediate Size Basketball");
  });
  it("Correct price", () => {
    expect(
      document.querySelector(`.js-product-price-${productId1}`).innerText
    ).toEqual("$10.90");
    expect(
      document.querySelector(`.js-product-price-${productId2}`).innerText
    ).toEqual("$20.95");
  });
});

describe("update suites: renderOrderSummary", () => {
  const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  beforeEach(() => {
    document.querySelector(".js-test-container").innerHTML = `
    <div class="js-checkout-header-middle-section"></div>
    <div class="js-order-summary"></div>
    <div class="js-payment-summary"></div>
    `;
  });
  afterAll(() => {
    document.querySelector(".js-test-container").innerHTML = "";
  });
  it("update product delivery", () => {
    spyOn(localStorage, "setItem");
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        {
          productId: productId1,
          quantity: 1,
          deliveryOptionId: 1,
        },
      ]);
    });
    loadFromStorage();
    renderOrderSummary();

    document.querySelector(`.js-delivery-${productId1}-3`).click();
    expect(
      document
        .querySelector(`.js-delivery-${productId1}-3`)
        .querySelector(`.js-input-3`).checked
    ).toEqual(true);
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productId1);
    expect(cart[0].deliveryOptionId).toEqual(3);
    expect(document.querySelector(`.js-shipping-price`).textContent).toEqual('$9.99')
    expect(document.querySelector(`.js-total-price`).textContent).toEqual('$22.98')
  });
});
