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
