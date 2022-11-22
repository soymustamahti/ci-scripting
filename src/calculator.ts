export class Calculator {
  lookup = [
    { M: 1000 },
    { CM: 900 },
    { D: 500 },
    { CD: 400 },
    { C: 100 },
    { XC: 90 },
    { L: 50 },
    { XL: 40 },
    { X: 10 },
    { IX: 9 },
    { V: 5 },
    { IV: 4 },
    { I: 1 },
  ];

  convertToRoman(num: number) {
    let roman = "";
    if (num < 1 || num > 99999)
      return `Not posible number too ${
        num < 1 ? "small" : "big"
      }, please enter a number between 1 and 99999`;
    for (let i = 0; i < this.lookup.length; i++) {
      while (num >= Object.values(this.lookup[i])[0]) {
        roman += Object.keys(this.lookup[i])[0];
        num -= Object.values(this.lookup[i])[0];
      }
    }
    return roman;
  }
}
