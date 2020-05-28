function getStyle(element) {
  element.style = element.style || {}
  for (const prop in element.computedStyle) {
    let propValue = element.computedStyle[prop].value
    if (propValue.toString().match(/^[\d.]+$|px$/)) {
      propValue = parseInt(propValue)
    }
    element.style[prop] = propValue
  }
  return element.style
}

function setFlexLayoutDefaultValue(style) {
  const propDefaultValue = {
    width: null,
    height: null,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch'
  }
  Object.entries(propDefaultValue).forEach(([prop, defaultValue]) => {
    if (!style[prop] || style[prop] === 'auto') {
      style[prop] = defaultValue
    }
  })
  return style
}

function getFlexLayoutParams(style) {
  let mainSize, mainStart, mainEnd, mainSign, mainBase;
  let crossSize, crossStart, crossEnd, crossSign, crossBase;

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
    mainBase = style[mainSize]
  } else {
    mainSign = +1
    mainBase = 0
  }

  if (style.flexWrap === 'wrap-reverse') {
    [crossStart, crossEnd] = [crossEnd, crossStart]
    crossSign = -1
    crossBase = style[crossSize]
  } else {
    crossSign = +1
    crossBase = 0
  }

  return {
    mainSize, mainStart, mainEnd, mainSign, mainBase,
    crossSize, crossStart, crossEnd, crossSign, crossBase,
  }
}

function layout(element) {
  if (/^(head|style|meta|title|script)$/.test(element.tagName) || !element.computedStyle) {
    return
  }
  const elementStyle = getStyle(element)
  if (elementStyle.display !== 'flex') {
    return
  }
  const items = element.children.filter(e => e.type === 'element').sort((a, b) => ((a.order || 0) - (b.order || 0)))

  const style = setFlexLayoutDefaultValue(elementStyle)

  const {
    mainSize, mainStart, mainEnd, mainSign, mainBase,
    crossSize, crossStart, crossEnd, crossSign, crossBase
  } = getFlexLayoutParams(style)

}

module.exports = layout
