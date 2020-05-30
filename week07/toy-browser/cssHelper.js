const css = require('css')

const rules = []

// 获取一个style标签里的所有规则
function addCssRules(text) {
  const ast = css.parse(text);
  rules.push(...ast.stylesheet.rules)
  return rules
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

// 检查一个元素和简单选择器是否匹配
function matchBySimpleSelector(element, selector) {
  if (!element && !selector) {
    return false
  }
  element.attributes = element.attributes || []

  if (selector.startsWith('#')) {  // HASH
    const attrId = element.attributes.find(a => a.name === 'id')
    return !!attrId && attrId.value === selector.slice(1)
  } else if (selector.startsWith('.')) {  // class
    const attrClass = element.attributes.find(a => a.name === 'class')
    return !!attrClass && attrClass.value.split(/\s+/g).includes(selector.slice(1))
  } else if (selector.match(/^\[(.+?)\]$/)) {  // attrib
    const match = /([\w-]+)\s*(?:([~|^$*]?=)\s*(\S+))?/.exec(RegExp.$1)
    if (!match) {
      return false
    }
    const name = match[1]
    const comparator = match[2] // 比较符： = ~= |= ^= $= *=
    const value = match[3] && match[3].replace(/["']/g, '') // 去除Value的引号
    const attr = element.attributes.find(a => a.name === name) // 属性名比较
    if (!attr) {
      return false
    }
    if (!comparator) { // 没有比较符号就没有属性值的比较
      return true
    }
    return attrValueCompareFuns[comparator](attr.value, value) // 属性值比较
  } else if (selector.match(/^:not\((.+)\)$/)) {  // negation
    return !matchBySimpleSelectorSequence(element, RegExp.$1)
  } else {  // type_selector
    return element.tagName === selector
  }
}

// 检查一个元素和简单选择器序列是否全匹配
function matchBySimpleSelectorSequence(element, simpleSelectorSequence) {
  if (!element || !simpleSelectorSequence) {
    return false
  }
  // `a#id.link[src^="https"]:not([src$='.pdf'])` -> ["a", "#id", ".link", "[src^="https"]", ":not([src$='.pdf'])"]
  const simpleSelectors = simpleSelectorSequence.split(/(?<=[\w\]\)])(?=[#.:\[])/)
  return simpleSelectors.every(simpleSelector => matchBySimpleSelector(element, simpleSelector))
}

// 查找一个与选择器匹配的element
function findMatchedElement(element, selector) {
  if (!element || !selector) {
    return null
  }

  if (selector.endsWith(' ')) {  // Descendant combinator
    selector = selector.replace(' ', '')
    do {
      element = element.parent
    } while (element && !matchBySimpleSelectorSequence(element, selector))
  } else if (selector.endsWith('>')) {  // Child combinator
    selector = selector.replace('>', '')
    element = element.parent
    if (!matchBySimpleSelectorSequence(element, selector)) {
      element = null
    }
  } else if (selector.endsWith('+')) {  // Next-sibling combinator
    selector = selector.replace('+', '')
    element = element.prev
    if (!matchBySimpleSelectorSequence(element, selector)) {
      element = null
    }
  } else if (selector.endsWith('~')) {  // Subsequent-sibling combinator
    selector = selector.replace('~', '')
    do {
      element = element.prev
    } while (element && !matchBySimpleSelectorSequence(element, selector))
  } else if (!matchBySimpleSelectorSequence(element, selector)) { // Current element
    element = null
  }

  return element || null
}

// 检查一个元素和一个CSS规则是否匹配
function matchByCssRule(element, rule) {
  // 'body  #form > .form-title  ~ label +  [role]' -> ["body ", "#form>", ".form-title~", "label+", "[role]"]
  const selectors = rule.selectors[0].trim().replace(/(?<=[~+>])\s+/g, '').replace(/\s+(?=[ ~+>])/g, '').split(/(?<=[ ~+>])/g)
  while (element && selectors.length) {
    element = findMatchedElement(element, selectors.pop())
  }

  return !!element
}

// 获取一个规则的优先级
function getSpecificity(rule) {
  const specificity = [0, 0, 0, 0]
  // 去除:not()，去除~+>，拆分复杂选择器
  rule.replace(/:not\((.+?)\)/, ' $1').replace(/[~+>]/g, ' ').split(/\s+/g).forEach(selector => {
    // 拆分简单选择器
    selector.split(/(?<=[\w\]])(?=[#.:\[])/).forEach(part => {
      if (part.startsWith('#')) {
        specificity[1] += 1
      } else if (part.startsWith('.')) {
        specificity[2] += 1
      } else {
        specificity[3] += 1
      }
    })
  })
  return specificity
}

// 优先级比较
function compare(sp1, sp2) {
  const index = sp1.findIndex((num, idx) => num !== sp2[idx])
  return index < 0 ? 0 : (sp1[index] - sp2[index])
}

// 计算一个元素的CSS
function computeCss(el) {
  el.computedStyle = el.computedStyle || {}
  rules.filter(rule => matchByCssRule(el, rule)).forEach(rule => {
    const specificity = getSpecificity(rule.selectors[0]);
    rule.declarations.forEach(({ property, value }) => {
      property = property.replace(/-([a-z])/g, (_, char) => char.toUpperCase()) // 转驼峰命名：'flex-direction' -> 'flexDirection'
      if (!el.computedStyle[property] || compare(specificity, el.computedStyle[property].specificity) >= 0) {
        el.computedStyle[property] = {
          value,
          specificity
        }
      }
    })
  })
}

module.exports = {
  addCssRules,
  computeCss,
}
