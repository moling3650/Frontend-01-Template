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

function findMatchedIndex(pattern, text) {
  const re = new RegExp(pattern.replace(/\?/g, '.'))
  const match = re.exec(text)
  return match ? match.index : -1
}

/**
 * @param {string} pattern
 * @param {string} text
 * @return {boolean}
 */
function match(pattern, text) {
  let ti = 0
  // 把模式串按*切成片段
  const re = /(?:^|\*)[^*]*/g
  let _match = null
  while (_match = re.exec(pattern)) {
    let subPattern = _match[0]
    let pi = 0
    // 处理模式串片段的前置的*和?
    while (pi < subPattern.length && /^[*?]$/.test(subPattern[pi])) {
      if (subPattern[pi] === '?') {
        ti++
      }
      pi++
    }

    subPattern = subPattern.slice(pi)
    const matchedIndex = findMatchedIndex(subPattern, text.slice(ti))
    if (matchedIndex === -1) {
      return false
    }
    ti += matchedIndex + subPattern.length

    if (re.lastIndex === pattern.length) {
      // 最后一个模式串片段
    }
  }
  return true
}

//                                       012345678901?3
// console.log(JSON.stringify(buildNext('01234017890123')))
// console.log(JSON.stringify(buildNext('01234017890103')))
// console.log(JSON.stringify(buildNext('012340178901x3')))

// 012340178901?3
// 0123401789012x
//           012340178901?3
// 0123401789010x
//             012340178901?3
// 0123401789011x
//              012340178901?3

