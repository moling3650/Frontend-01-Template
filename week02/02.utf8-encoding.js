/**
 * @param {string} str
 * @return ArrayBuffer
 */
function utf8Encoding(str) {
  return str.split('').map((s) => `\\u${s.charCodeAt().toString(16)}`).join('');
}

console.log(utf8Encoding('极客大学')); //\u6781\u5ba2\u5927\u5b66
