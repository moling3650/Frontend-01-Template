/**
 * @param {string} char
 * @return {string}
 */
function charToUtf8(char) {
  const binary = char.codePointAt().toString(2);
  if (binary.length < 8) {
    return binary.padStart(8, '0');
  }
  const headers = ['0', '110', '1110', '11110'];
  const sequence = [];
  for (let end = binary.length; end > 0; end -= 6) {
    const sub = binary.slice(Math.max(end - 6, 0), end);

    if (sub.length === 6) {
      sequence.unshift(`10${sub}`);
    } else {
      const header = headers[sequence.length];
      sequence.unshift(`${header}${sub.padStart(8 - sub.length - header.length, '0')}`);
    }
  }
  return sequence.join('|');
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
