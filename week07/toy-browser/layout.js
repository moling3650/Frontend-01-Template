// Size默认值
const sizeDefaultValues = {
  width: null,
  height: null,
}
// Flex布局默认值
const flexLayoutDefaultValues = {
  flexDirection: 'row',
  flexWrap: 'nowrap',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  alignContent: 'stretch',
}
// 设置CSS默认值
function setCssDefaultValues(style, defaultValues) {
  Object.entries(defaultValues).forEach(([prop, defaultValue]) => {
    if (!style[prop] || style[prop] === 'auto') {
      style[prop] = defaultValue
    }
  })
}
// 设置元素Style，初始化默认值
function setStyle(element) {
  element.style = element.style || {}
  for (const prop in element.computedStyle) {
    let propValue = element.computedStyle[prop].value
    if (propValue.toString().match(/^[\d.]+$|px$/)) {
      propValue = parseInt(propValue)
    }
    element.style[prop] = propValue
  }
  setCssDefaultValues(element.style, sizeDefaultValues) // 设置默认宽高
}
// 获取Flex布局关键参数值
function getFlexLayoutParams(style) {
  let mainSize, mainStart, mainEnd, mainSign;
  let crossSize, crossStart, crossEnd, crossSign;

  if (style.flexDirection.startsWith('row')) {
    mainSize = 'width'
    mainStart = 'left'
    mainEnd = 'right'

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  } else if (style.flexDirection.startsWith('column')) {
    mainSize = 'height'
    mainStart = 'top'
    mainEnd = 'bottom'

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  }

  if (style.flexDirection.endsWith('reverse')) {
    [mainStart, mainEnd] = [mainEnd, mainStart]
    mainSign = -1
  } else {
    mainSign = +1
  }

  if (style.flexWrap === 'wrap-reverse') {
    [crossStart, crossEnd] = [crossEnd, crossStart]
    crossSign = -1
  } else {
    crossSign = +1
  }

  return {
    mainSize, mainStart, mainEnd, mainSign,
    crossSize, crossStart, crossEnd, crossSign,
  }
}

// 元素分行
function getFlexLines(element, mainSize, crossSize) {
  const items = element.children.filter(e => e.type === 'element')
    .sort((a, b) => ((a.style.order || 0) - (b.style.order || 0)))
  const isWrap = element.style.flexWrap !== 'nowrap'
  const lineMainSize = element.style[mainSize]

  const flexLines = []
  items.forEach(item => {
    let line = flexLines[flexLines.length - 1]
    if (!line || (isWrap && !item.style.flex && line.usedMainSize + item.style[mainSize] > lineMainSize)) {
      line = []
      line.mainSize = lineMainSize // 主轴尺寸
      line.crossSize = isWrap ? 0 : element.style[crossSize]  // 交叉轴尺寸
      line.usedMainSize = 0  // 已用主轴尺寸
      line.flexTotal = 0 // flex总值
      flexLines.push(line)
    }

    if (item.style[mainSize] > lineMainSize) {
      item.style[mainSize] = lineMainSize
    }
    if (item.style.flex) {
      line.flexTotal += item.style.flex
    } else if (item.style[mainSize]) {
      line.usedMainSize += item.style[mainSize]
    }
    if (item.style[crossSize]) {
      line.crossSize = Math.max(line.crossSize, item.style[crossSize])
    }

    line.push(item)
  })

  return flexLines
}

function layout(element) {
  if (/^(head|style|meta|title|script)$/.test(element.tagName) || !element.computedStyle) {
    return
  }
  setStyle(element)
  if (element.style.display !== 'flex') {
    return
  }

  setCssDefaultValues(element.style, flexLayoutDefaultValues)

  let {
    mainSize, mainStart, mainEnd, mainSign,
    crossSize, crossStart, crossEnd, crossSign
  } = getFlexLayoutParams(element.style)

  // 计算主轴
  if (element.style[mainSize] === null) {
    element.style[mainSize] = element.children.filter(e => e.type === 'element')
      .map(item => item.style[mainSize] || 0)
      .reduce((total, s) => total + s, 0)
  }
  const mainBase = mainSign > 0 ? 0 : element.style[mainSize]

  const flexLines = getFlexLines(element, mainSize, crossSize)

  flexLines.forEach(line => {
    const lineFreeMainSixe = Math.max(line.mainSize - line.usedMainSize, 0) // 每行可用空间
    // 计算每行的起始位置和元素间距
    let currentMainStart = mainBase
    let gutter = 0
    if (line.flexTotal === 0) {
      if (element.style.justifyContent === 'flex-end') {
        currentMainStart = mainBase + lineFreeMainSixe * mainSign
      } else if (element.style.justifyContent === 'center') {
        currentMainStart = mainBase + lineFreeMainSixe / 2 * mainSign
      } else if (element.style.justifyContent === 'space-between') {
        gutter = lineFreeMainSixe / (line.length - 1)
      } else if (element.style.justifyContent === 'space-around') {
        gutter = lineFreeMainSixe / line.length
        currentMainStart = mainBase + gutter / 2 * mainSign
      }
    }
    const scale = Math.min(line.mainSize / line.usedMainSize, 1) // 非弹性元素缩放比例
    // 计算容器里所有元素的mainSize\mainStart\mainEnd
    line.forEach(item => {
      if (item.style.flex) {
        item.style[mainSize] = lineFreeMainSixe * item.style.flex / line.flexTotal
      } else {
        item.style[mainSize] *= scale
      }

      item.style[mainStart] = currentMainStart
      item.style[mainEnd] = currentMainStart + item.style[mainSize] * mainSign
      currentMainStart = item.style[mainEnd] + gutter * mainSign
    })
  })

  // 计算交叉轴
  const usedCrossSize = flexLines.map(line => line.crossSize).reduce((total, s) => total + s, 0)
  if (element.style[crossSize] === null) {
    element.style[crossSize] = usedCrossSize
  }

  const crossBase = crossSign > 0 ? 0 : element.style[crossSize]

  const freeCrossSize = element.style[crossSize] - usedCrossSize
  let currentCrossStart = crossBase
  let gutter = 0
  if (element.style.alignContent === 'stretch') {
    flexLines.forEach(line => line.crossSize += freeCrossSize / flexLines.length)
  } else if (element.style.alignContent === 'flex-end') {
    currentCrossStart = crossBase + freeCrossSize * crossSign
  } else if (element.style.alignContent === 'center') {
    currentCrossStart = crossBase + freeCrossSize / 2 * crossSign
  } else if (element.style.alignContent === 'space-between') {
    gutter = freeCrossSize / (flexLines.length - 1)
  } else if (element.style.alignContent === 'space-around') {
    gutter = freeCrossSize / flexLines.length
    currentCrossStart = crossBase + gutter / 2 * crossSign
  }

  flexLines.forEach(line => {
    // 计算容器里所有元素的crossSize\crossStart\crossEnd
    line.forEach(item => {
      const alignItem = item.alignSelf || element.style.alignItems
      if (item.style[crossSize] === null) {
        item.style[crossSize] = (alignItem === 'stretch') ? line.crossSize : 0
      }

      const lineFreeCrossSize = line.crossSize - item.style[crossSize]
      item.style[crossStart] = currentCrossStart
      if (alignItem === 'center') {
        item.style[crossStart] += lineFreeCrossSize / 2 * crossSign
      } else if (alignItem === 'flex-end') {
        item.style[crossStart] += lineFreeCrossSize * crossSign
      }
      item.style[crossEnd] = item.style[crossStart] + item.style[crossSize] * crossSign
    })
    currentCrossStart = currentCrossStart + (line.crossSize + gutter) * crossSign
  });
}

module.exports = layout
