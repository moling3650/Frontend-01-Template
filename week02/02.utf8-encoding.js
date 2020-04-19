/**
 * @param {string} str
 * @return ArrayBuffer
 */
function utf8Encoding(str) {
  const buffer = new ArrayBuffer(str.length);
  const view = new DataView(buffer);
  for (let i = 0; i < str.length; i += 1) {
    const charCode = str[i].charCodeAt();
    view.setUint8(i, charCode);
  }
  return buffer;
}

const view = new DataView(utf8Encoding('ab'));
console.log(view.buffer);
