function matchByClassSelector(selector, element) {
  return element.className.split(/\s+/g).includes(selector.replace('.', ''))
}

function matchByTypeSelector(selector, element) {
  return element.tagName === selector.toUpperCase()
}

function matchByIdSelector(selector, element) {
  return element.id === selector.replace('#', '')
}

// 属性值比较函数
const attrValueCompareFuns = {
  '=': (attrValue, value) => attrValue === value,
  '~=': (attrValue, value) => attrValue.split(/\s+/g).includes(value),
  '|=': (attrValue, value) => attrValue === value || attrValue.startsWith(`${value}-`),
  '^=': (attrValue, value) => attrValue.startsWith(value),
  '$=': (attrValue, value) => attrValue.endsWith(value),
  '*=': (attrValue, value) => attrValue.includes(value),
}

function matchByAttributeSelector(selector, element) {
  //                     key         comparetor    value
  const match = /^\[\s*([\w-]+)\s*(?:([~|^$*]?=)\s*(\S+))?\s*\]$/.exec(selector)
  if (!match) {
    return false
  }
  // 属性名比较
  const name = match[1]
  const attrValue = element.getAttribute(name)
  if (attrValue === null) {
    return false
  }
  // 没有比较符号就没有属性值的比较
  const comparator = match[2]
  if (!comparator) {
    return true
  }
  // 属性值比较
  const value = match[3].replace(/["']/g, '') // 去除value的引号
  return attrValueCompareFuns[comparator](attrValue, value)
}

// 检查一个元素和简单选择器是否匹配
function matchBySimpleSelector(selector, element) {
  if (!selector || !element) {
    return false
  } else if (selector.startsWith('#')) { // HASH
    return matchByIdSelector(selector, element)
  } else if (selector.startsWith('.')) { // class
    return matchByClassSelector(selector, element)
  } else if (selector.match(/^\[(.+?)\]$/)) { // attrib
    return matchByAttributeSelector(selector, element)
  } else if (selector.match(/^:not\((.+)\)$/)) { // negation
    return !matchBySimpleSelectorSequence(element, RegExp.$1)
  } else { // type_selector  
    return matchByTypeSelector(selector, element)
  }
}

// 检查一个元素和简单选择器序列是否全匹配
function matchBySimpleSelectorSequence(simpleSelectorSequence, element) {
  if (!simpleSelectorSequence || !element) {
    return false
  }
  // `a#id.link[src^="https"]:not([targer='_blank'])` -> ["a", "#id", ".link", "[src^="https"]", ":not([targer='_blank'])"]
  const simpleSelectors = simpleSelectorSequence.split(/(?<=[\w\]\)])(?=[#.:\[])/)
  return simpleSelectors.every(simpleSelector => matchBySimpleSelector(simpleSelector, element))
}

// 获取下一个待考查的元素
function getNextElementKey(combinator) {
  return {
    '>': 'parentElement',
    '+': 'previousElementSibling',
  }[combinator]
}

// 查找一个与选择器匹配的element
function findMatchedElement(selector, element) {
  if (!selector || !element) {
    return null
  }
  const combinator = /[>+]$/.test(selector) ? selector[selector.length - 1] : ''
  const nextElementKey = getNextElementKey(combinator)

  if (/[>+]$/.test(selector)) {  // Child combinator OR Next-sibling combinator
    selector = selector.replace(/[>+]$/, '')
    element = element[nextElementKey]
    if (!matchBySimpleSelectorSequence(selector, element)) {
      element = null
    }
  } else if (!matchBySimpleSelectorSequence(selector, element)) { // 唯一没有combinator的当前元素
    element = null
  }
  return element || null
}

// 检查一个元素和一个选择器是否匹配
function match(selector, element) {
  const selectors = rule.trim().replace(/(?<=[+>])\s+/g, '').replace(/\s+(?=[+>])/g, '').split(/(?<=[+>])/g)
  while (element && selectorParts.length) {
    element = findMatchedElement(selectorParts.pop(), element)
  }
  return !!element
}
