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
    selector = RegExp.$1.replace(/:not\(.*?\)/g, '') // 忽略:not()内的:not选择器
    return !matchBySimpleSelectorSequence(selector, element)
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
  const simpleSelectors = simpleSelectorSequence.split(/(?<!\([^\)]*)(?=[#\.\[:])/g)
  return simpleSelectors.every(simpleSelector => matchBySimpleSelector(simpleSelector, element))
}

// 查找一个与选择器匹配的element
function findMatchedElement(selectorPart, element) {
  if (!selectorPart || !element) {
    return null
  }
  const [selector, combinator] = selectorPart.split(/(?=[ ~+>]$)/)
  const nextElementKey = {
    '>': 'parentElement',
    ' ': 'parentElement',
    '+': 'previousElementSibling',
    '~': 'previousElementSibling',
  }[combinator]

  if (/^[>+]$/.test(combinator)) {  // Child combinator OR Next-sibling combinator
    element = element[nextElementKey]
    if (!matchBySimpleSelectorSequence(selector, element)) {
      element = null
    }
  } else if (/^[ ~]$/.test(combinator)) {  // Descendant combinator OR Subsequent-sibling combinator
    while (element) {
      element = element[nextElementKey]
      const matchedElement = findMatchedElementByComplexSelector(selector, element)
      if (matchedElement) {
        element = matchedElement
        break
      }
    }
  } else if (!matchBySimpleSelectorSequence(selector, element)) { // 唯一没有combinator的当前元素
    element = null
  }
  return element || null
}

// 查找一个与复杂选择器匹配的element，只包含>、+、~组合器
function findMatchedElementByComplexSelector(selector, element) {
  if (!selector || !element) {
    return null
  }
  // 拆分组合器，~组合器会和+组合器合并，因为~组合器和+组合器会存在回溯的问题
  // '.a+.b~.c>.d~.e+.f>.g' -> [".a+.b~", ".c>", ".d~", ".e+", ".f>", ".g"]
  const selectorParts = selector.replace(/([^~>]+~(?!=)|[^+>]+?[+>])/g, '$1\0').split('\0')
  while (element && selectorParts.length) {
    element = findMatchedElement(selectorParts.pop(), element)
  }
  return element
}

function match(rule, element) {
  if (!rule || !element) {
    return null
  }
  // 拆分后代组合器，因为后代组合器和>~+组合器会存在回溯的问题
  // '.a .b~.c>.d .e+.f .g' -> [".a ", ".b~.c>.d ", ".e+.f ", ".g"]
  const selectorParts = rule.trim().replace(/\s*([~+ >])\s*/g, '$1').split(/(?<= )/g)
  while (element && selectorParts.length) {
    const selector = selectorParts.pop()
    if (selector.endsWith(' ')) { // Descendant combinator 
      element = findMatchedElement(selector, element)
    } else {
      element = findMatchedElementByComplexSelector(selector, element)
    }
  }
  return !!element
}
