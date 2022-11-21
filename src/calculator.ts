export class Calculator {
  value: number;
  lookup: any = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  };

  constructor() {
    this.value = 0;
  }

  add(n: number): number {
    this.value += n;
    return this.value;
  }

  convertToRoman(num: number) {
    let roman = "";
    let i;
    if (num < 1 || num > 99999)
      return `Not posible number too ${
        num < 1 ? "small" : "big"
      }, please enter a number between 1 and 99999`;
    for (i in this.lookup) {
      while (num >= this.lookup[i]) {
        roman += i;
        num -= this.lookup[i];
      }
    }
    return roman;
  }
}
