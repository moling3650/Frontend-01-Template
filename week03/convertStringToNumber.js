/**
 * @param {string} chars
 * @param {number} x
 * @return {number}
 */
function convertStringToNumber(chars, x = 10) {
  if (!/^(0\.?|0?\.\d+|[1-9]\d*\.?\d*?)$/.test(chars)) {
    throw Error(`${chars} 并不是一个合法的数字`);
  }
  const zeroCodePoint = '0'.codePointAt(0);
  let integer = 0;
  let i = 0;
  for (; i < chars.length && chars[i] !== '.'; i++) {
    integer *= x;
    integer += chars[i].codePointAt(0) - zeroCodePoint;
  }

  let decimal = 0;
  let j = chars.length - 1;
  for (; i < j; j--) {
    decimal += chars[j].codePointAt(0) - zeroCodePoint;
    decimal /= x;
  }
  return integer + decimal;
}

console.log(convertStringToNumber('123.9')); // 12.9
console.log(convertStringToNumber('.0'));  // 0
console.log(convertStringToNumber('9.'));  // 9
console.log(convertStringToNumber('110000', 2));  // 48 
console.log(convertStringToNumber('123.4', 8));  // 83.5
console.log(convertStringToNumber('11.4', 16));  // 17.25
console.log(convertStringToNumber('01'));  // error
