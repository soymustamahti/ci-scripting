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
    for (i in this.lookup) {
      while (num >= this.lookup[i]) {
        roman += i;
        num -= this.lookup[i];
      }
    }
    return roman;
  }
}
