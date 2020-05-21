const css = require('css')

const rules = []

// 获取一个style标签里的所有规则
function addCssRules(text) {
  const ast = css.parse(text);
  rules.push(...ast.stylesheet.rules)
  return rules
}

// 检查一个元素和简单选择器是否匹配
function matchSimpleSelector(element, selector) {
  if (!element.attributes && !selector) {
    return false
  }
  if (selector.startsWith('#')) {
    const attrId = element.attributes.find(a => a.name === 'id')
    return !!attrId && attrId.value === selector.slice(1)
  } else if (selector.startsWith('.')) {
    const attrClass = element.attributes.find(a => a.name === 'class')
    return !!attrClass && attrClass.value.split(/\s+/g).indexOf(selector.slice(1)) !== -1
  } else {
    return element.tagName === selector
  }
}

// 检查一个元素和组合简单选择器是否匹配
function matchSimpleSelectors(element, selector) {
  return !!element && selector.split(/(?=[.#])/).every(s => matchSimpleSelector(element, s))
}

// 检查一个元素和复杂选择器（支持>和+）是否匹配
function matchCombinators(element, rule) {
  const selectors = rule.split(/(?<=[+>])/g)
  // 收集要检查的元素和规则
  const checkList = []
  while (selectors.length) {
    let selector = selectors.pop()
    if (selector.endsWith('>')) {
      element = element && element.parent
      selector = selector.slice(0, selector.length - 1)
    } else if (selector.endsWith('+')) {
      element = element && element.prev
      selector = selector.slice(0, selector.length - 1)
    }
    checkList.unshift({ element, selector })
  }
  return checkList.every(({ element, selector }) => matchSimpleSelectors(element, selector))
}

// 检查一个元素和一个CSS规则是否匹配
function matchRule(element, rule) {
  // 去除选择器+和>前后的空格再做拆分
  const selectorParts = rule.selectors[0].replace(/\s+(?=[+>])|(?<=[+>])\s+/g, '').split(/\s+/g).reverse()
  let isCurrentElement = true
  while (selectorParts.length && element) {
    if (matchCombinators(element, selectorParts[0])) {
      const selector = selectorParts.shift()
      // 在子选择器需要做特殊处理，一旦匹配要上移N个（父元素的个数）
      for (let i = 1; i < selector.split('>').length; i++) {
        element = element.parent
      }
    } else if (isCurrentElement) {
      return false
    }
    isCurrentElement = false
    element = element.parent
  }
  return !selectorParts.length
}

// 获取一个规则的优先级
function getSpecificity(rule) {
  const specificity = [0, 0, 0, 0];
  rule.replace(/[+>]/g, ' ').split(/\s+/g).forEach(selector => {
    selector.split(/(?=[.#])/).forEach(part => {
      if (part.startsWith('#')) {
        specificity[1] += 1
      } else if (part.startsWith('.')) {
        specificity[2] += 1
      } else {
        specificity[3] += 1
      }
    })
  })
  return specificity;
}

// 优先级比较
function compare(sp1, sp2) {
  const index = sp1.findIndex((num, idx) => num !== sp2[idx])
  return index < 0 ? 0 : (sp1[index] - sp2[index])
}


// 计算一个元素的CSS
function computeCss(el) {
  el.computedStyle = el.computedStyle || {}
  rules.filter(rule => matchRule(el, rule)).forEach(rule => {
    const specificity = getSpecificity(rule.selectors[0]);
    rule.declarations.forEach(({ property, value }) => {
      if (!el.computedStyle[property] || compare(specificity, el.computedStyle[property].specificity) >= 0) {
        el.computedStyle[property] = {
          value,
          specificity
        }
      }
    })
  })

  return el
}

module.exports = {
  addCssRules,
  computeCss,
}
