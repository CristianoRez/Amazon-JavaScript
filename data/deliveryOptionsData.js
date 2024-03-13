import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;
  deliveryOptionsData.forEach((option) => {
    if (option.id === Number(deliveryOptionId)) {
      deliveryOption = option;
    }
  });
  return deliveryOption;
}

export function calculateDeliveryDate(deliveryOption) {
  let today = dayjs();
  let deliveryDate;
  let i = 0;
  while (i < deliveryOption.days) {
    deliveryDate = today.format("dddd");
    if (deliveryDate !== "Saturday" && deliveryDate !== "Sunday") {
      today = today.add(1, "days");
      deliveryDate = today.format("dddd");
      i++;
    } else {
      today = today.add(1, "days");
      deliveryDate = today.format("dddd");
    }
  }
  deliveryDate = today.format("dddd, MMMM D");
  return deliveryDate;
}

export const deliveryOptionsData = [
  {
    id: 1,
    days: 7,
    priceCents: 0,
  },
  {
    id: 2,
    days: 3,
    priceCents: 499,
  },
  {
    id: 3,
    days: 1,
    priceCents: 999,
  },
];
