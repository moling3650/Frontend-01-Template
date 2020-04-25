/**
 * @param {number} number
 * @param {number} x
 * @return {string}
 */
function convertNumberToString(number, x = 10) {
  let integer = Math.floor(number);
  let decimal = number - integer;
  let string = !integer ? '0' : '';
  while (integer > 0) {
    string = `${integer % x}${string}`;
    integer = Math.floor(integer / x);
  }

  if (decimal) {
    string += '.';
    while (decimal && !/\.\d{20}$/.test(string)) { // 最大保留20位小数
      decimal *= x;
      string += `${Math.floor(decimal)}`;
      decimal -= Math.floor(decimal);
    }
  }
  return string;
}

console.log(convertNumberToString(0, 10));  // "0"
console.log(convertNumberToString(123.456, 10)); // "123.45600000000000306954"
console.log(convertNumberToString(10.25, 8)); // "12.2"
console.log(convertNumberToString(16.5, 16)); // "10.8"
