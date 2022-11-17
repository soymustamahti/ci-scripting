import { Calculator } from "../calculator";
import { expect } from "chai";

const tests = [
  { input: 10, expected: "X" },
  { input: 5, expected: "V" },
  { input: 1, expected: "I" },
];

describe("calculator", () => {
  tests.forEach((test: { input: number; expected: string }) => {
    it(`given number ${test.input} should return ${test.expected}`, () => {
      const calculator = new Calculator();
      expect(calculator.convertToRoman(test.input)).to.equal(test.expected);
    });
  });
});
