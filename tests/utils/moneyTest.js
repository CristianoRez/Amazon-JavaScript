import { formatCurrency } from "../../scripts/utils/money.js";

describe("Test Suit: formatCurrency", () => {
  it("Convert cents to dollars", () => {
    expect(formatCurrency(2095)).toEqual("20.95");
  });
  it('Works with 0', () => {
    expect(formatCurrency(0)).toEqual('0.00');
  })
  it('Round to the nearest number', () => {
    expect(formatCurrency(2000.5)).toEqual('20.01');
  })
});
