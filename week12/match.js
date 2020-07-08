/**
 * 蛮力算法
 * @param {string} pattern
 * @param {string} text
 * @return {number}
 */
function bf_match(pattern, text) {
  let pi = 0
  let ti = 0
  while (pi < pattern.length && ti < text.length) {
    if (pattern[pi] === text[ti]) {
      ti += 1
      pi += 1
    } else {
      ti -= pi - 1
      pi = 0
    }
  }
  return ti - pi
}

/**
 * KMP算法
 * @param {string} pattern
 * @param {string} text
 * @return {number}
 */
function kmp_match(pattern, text) {
  const next = buildNext(pattern)
  let pi = 0
  let ti = 0
  while (pi < pattern.length && ti < text.length) {
    if (pi < 0 || pattern[pi] === text[ti]) {
      pi += 1
      ti += 1
    } else {
      pi = next[pi]
    }
  }
  return ti - pi
}

/**
 * @param {string} pattern
 * @return {Array}
 */
function buildNext(pattern) {
  const next = new Array(pattern.length).fill(-1)
  let j = 0
  let k = -1

  while (j < pattern.length - 1) {
    if (k < 0 || pattern[j] === pattern[k]) {
      j += 1
      k += 1
      next[j] = k
    } else {
      k = next[k]
    }
  }
  return next
}

/**
 * @param {string} s
 * @param {string} p
 * @param {object} options
 * @return {number}
 */
function findMatchedLastIndex(s, p, options) {
  const pattern = p.replace(/[*?]/g, char => char === '*' ? '' : '.')
  const re = new RegExp(`${options.isFirst && !options.hasStar ? '^' : ''}${pattern}${options.isLast ? '$' : ''}`)
  const match = re.exec(s)
  return match ? match.index : -1
}

/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
const isMatch = function (s, p) {
  if (p === '') {
    return s === ''
  }
  const re = /(?:^\*?|\*)[^*]*/g
  let match = null
  let index = 0
  while (match = re.exec(p)) {
    const subPattern = match[0]
    const hasStar = subPattern.startsWith('*')
    const lastIndex = findMatchedLastIndex(s.slice(index), subPattern, {
      isFirst: match.index === 0,
      isLast: re.lastIndex === p.length,
      hasStar
    })
    if (lastIndex !== -1) {
      index += lastIndex + subPattern.length - (hasStar ? 1 : 0)
    } else {
      return false
    }
  }
  return true
}
