import {
  addToCart,
  loadFromStorage,
  cart,
  removeFromCart,
  updateDeliveryOption,
} from "../../data/cart.js";
import { renderOrderSummary } from "../../scripts/checkout/orderSummary.js";

describe("Cart suites: addToCart", () => {
  it("Add an already existing product to the cart", () => {
    spyOn(localStorage, "setItem");
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 1,
          deliveryOptionId: 1,
        },
      ]);
    });
    loadFromStorage();
    addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
    expect(cart[0].quantity).toEqual(2);
  });

  it("Adds a new product to the cart", () => {
    spyOn(localStorage, "setItem");
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([]);
    });
    loadFromStorage();
    addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
    expect(cart[0].quantity).toEqual(1);
  });
});

describe("Cart suites: removeFromCart", () => {
  const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  const productId2 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c5";
  it("Remove product that is on the cart", () => {
    spyOn(localStorage, "setItem");
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 1,
          deliveryOptionId: 1,
        },
      ]);
    });
    loadFromStorage();
    removeFromCart(productId1);
    expect(cart).toEqual([]);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([])
    );
  });
  it("Remove product that is not on the cart", () => {
    spyOn(localStorage, "setItem");
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 1,
          deliveryOptionId: 1,
        },
      ]);
    });
    loadFromStorage();
    removeFromCart(productId2);
    expect(cart).toEqual([
      {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 1,
        deliveryOptionId: 1,
      },
    ]);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 1,
          deliveryOptionId: 1,
        },
      ])
    );
  });
});
describe("cart suites: updateDeliveryOption()", () => {
  const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  afterAll(() => {
    document.querySelector(".js-test-container").innerHTML = "";
  });
  beforeEach(() => {
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
    document.querySelector(`.js-test-container`).innerHTML = `
    <div class="js-order-summary"></div>
    <div class="js-payment-summary"></div>
    `;
    loadFromStorage();
    renderOrderSummary();
  });
  it("Update delivery option of a product", () => {
    document.querySelector(`.js-delivery-${cart[0].productId}-3`).click();
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([
        {
          productId: productId1,
          quantity: 1,
          deliveryOptionId: 3,
        },
      ])
    );
    expect(cart).toEqual([
      { productId: productId1, quantity: 1, deliveryOptionId: 3 },
    ]);
  });

  it("Update delivery option of a inexistent product", () => {
    updateDeliveryOption("kdjfaslf", 3);
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    expect(cart).toEqual([
      { productId: productId1, quantity: 1, deliveryOptionId: 1 },
    ]);
  });
  it("update deliveryOption of a inexistent delivery", () => {
    updateDeliveryOption(productId1, 4);
    expect(cart).toEqual([
      {
        productId: productId1,
        quantity: 1,
        deliveryOptionId: 1,
      },
    ]);
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  });
});
