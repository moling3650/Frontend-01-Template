/**
 * @param {string} char
 * @return {string}
 */
function charToUtf8(char) {
  let binary = char.codePointAt().toString(2);
  if (binary.length < 8) {
    return binary.padStart(8, '0');
  }
  binary = binary.replace(/(?=(\B)([01]{6})+$)/g, '10');
  const chunkCount = Math.ceil(binary.length / 8);
  binary = `${'1'.repeat(chunkCount)}${binary.padStart(7 * chunkCount, '0')}`;
  return binary.replace(/(?=(\B)([01]{8})+$)/g, '|');
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
