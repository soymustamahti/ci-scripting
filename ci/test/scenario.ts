export const tests = [
  { input: 10, expected: "X" },
  { input: 5, expected: "V" },
  { input: 1, expected: "I" },
  {
    input: 53764,
    expected: "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMDCCLXIV",
  },
  { input: 346, expected: "CCCXLVI" },
  { input: 754, expected: "DCCLIV" },
  { input: 7658, expected: "MMMMMMMDCLVIII" },
  {
    input: 89789,
    expected:
      "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMDCCLXXXIX",
  },
  { input: 988, expected: "CMLXXXVIII" },
  { input: 6758, expected: "MMMMMMDCCLVIII" },
  {
    input: 98677,
    expected:
      "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMDCLXXVII",
  },
  {
    input: 56478,
    expected:
      "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMCDLXXVIII",
  },
  { input: 7686, expected: "MMMMMMMDCLXXXVI" },
  { input: 678, expected: "DCLXXVIII" },
  { input: 767, expected: "DCCLXVII" },
  { input: 3486, expected: "MMMCDLXXXVI" },
  { input: 154, expected: "CLIV" },
  { input: 987, expected: "CMLXXXVII" },
  {
    input: 99999,
    expected:
      "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMCMXCIX",
  },
  {
    input: 9235342532,
    expected:
      "Not posible number too big, please enter a number between 1 and 99999",
  },
  {
    input: -21,
    expected:
      "Not posible number too small, please enter a number between 1 and 99999",
  },
  { input: 235, expected: "CCXXXV" },
  { input: 21, expected: "XXI" },
  {
    input: 0,
    expected:
      "Not posible number too small, please enter a number between 1 and 99999",
  },
  { input: 10000, expected: "MMMMMMMMMM" },
  { input: 324, expected: "CCCXXIV" },
  {
    input: -0,
    expected:
      "Not posible number too small, please enter a number between 1 and 99999",
  },
  { input: 235, expected: "CCXXXV" },
  { input: 30, expected: "XXX" },
  { input: 69, expected: "LXIX" },
  { input: 43, expected: "XLII" },
];
