import { Calculator } from "../calculator";
import { expect } from "chai";
import { tests } from "./scenario";

describe("calculator", () => {
  tests.forEach((test: { input: number; expected: string }) => {
    it(`given number ${test.input} should return ${test.expected}`, () => {
      const calculator = new Calculator();
      expect(calculator.convertToRoman(test.input)).to.equal(test.expected);
    });
  });
});
