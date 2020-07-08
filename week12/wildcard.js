/**
 * @param {string} s
 * @param {string} p
 * @param {object} options
 * @return {number}
 */
function findMatchedIndex(s, p, options) {
  const pattern = p.replace(/\?/g, '.');
  const re = new RegExp(`${options.isFirst && !options.hasStar ? '^' : ''}${pattern}${options.isLast ? '$' : ''}`);
  const match = re.exec(s);
  return match ? match.index : -1;
}

/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
const isMatch = function (s, p) {
  if (p === '') {
    return s === '';
  }
  const re = /(?:^\*?|\*)[^*]*/g;
  let match = null;
  let lastIndex = 0;
  while (match = re.exec(p)) {
    const subPattern = match[0].replace('*', '');
    const matchedIndex = findMatchedIndex(s.slice(lastIndex), subPattern, {
      isFirst: match.index === 0,
      isLast: re.lastIndex === p.length,
      hasStar: match[0].startsWith('*'),
    });
    if (matchedIndex !== -1) {
      lastIndex += matchedIndex + subPattern.length;
    } else {
      return false;
    }
  }
  return true;
};