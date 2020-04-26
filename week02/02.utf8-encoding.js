/**
 * @param {string} char
 * @return {string}
 */
function charToUtf8(char) {
  let bits = char.codePointAt().toString(2);
  if (bits.length < 8) {
    return bits.padStart(8, '0');
  }
  const byteCount = Math.ceil((bits.length - 1) / 5);
  bits = bits.replace(/(?=(^|[01])([01]{6})+$)/g, '10');
  bits = `${'1'.repeat(byteCount)}${bits.padStart(7 * byteCount, '0')}`;
  return bits.replace(/(?=(\B)([01]{8})+$)/g, '|');
}

/**
 * @param {string} str
 * @return {Array}
 */
function utf8Encoding(str) {
  return Array.from(str).map((char) => charToUtf8(char));
}

console.log(utf8Encoding('\u{7f}\u{7ff}\u{ffff}\u{10ffff}'));
// ["01111111", "11011111|10111111", "11101111|10111111|10111111", "11110100|10001111|10111111|10111111"]
