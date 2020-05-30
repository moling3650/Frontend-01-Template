const cssHelper = require('./cssHelper')
const layout = require('./layout')
const EOF = Symbol('EOF')
let currnetToken = null
let characterToken = ''
let currnetAttribute = null
const stack = [{ type: 'document', children: [] }]

// 处理一个token
function emit(token) {
  const top = stack[stack.length - 1]
  if (token.type === 'startTag') {
    let element = {
      type: 'element',
      tagName: token.tagName,
      parent: top,
      attributes: Object.keys(token).filter(k => !/^t(ype|agName)$/.test(k)).map(k => ({ name: k, value: token[k] })),
      children: []
    }
    if (top.children.length) {
      // 建立兄弟关系
      for (let i = top.children.length - 1; i >= 0; i--) {
        const node = top.children[i];
        if (node.type === 'element') {
          node.next = element
          element.prev = node
          break
        }
      }
    }
    cssHelper.computeCss(element)
    top.children.push(element)
    stack.push(element)
    if (token.isSelfClosing) {
      layout(element)
      stack.pop()
    }
  } else if (token.type === 'endTag') {
    if (token.tagName !== top.tagName) {
      throw new TypeError()
    }
    if (token.tagName === 'style') {
      cssHelper.addCssRules(top.children[0].content)
    }
    layout(top)
    stack.pop()
  } else if (token.type === 'text') {
    top.children.push(token)
  }
}

function dataState(c) {
  if (c === '<') {
    if (characterToken) {
      emit({ type: 'text', content: characterToken })
      characterToken = ''
    }
    return tagOpenState
  } if (c === EOF) {
    emit({ tpye: 'EOF' })
    return dataState
  } else {
    characterToken += c
    return dataState
  }
}

function tagOpenState(c) {
  if (c === '/') {
    return endTagOpenState
  } else if (/^[A-Za-z]$/.test(c)) {
    currnetToken = { type: 'startTag', tagName: '' }
    return tagNameState(c)
  } else {
    return dataState(c)
  }
}

function endTagOpenState(c) {
  if (/^[A-Za-z]$/.test(c)) {
    currnetToken = { type: 'endTag', tagName: '' }
    return tagNameState(c)
  }
}

function tagNameState(c) {
  if (/^[\t\n\f ]$/.test(c)) {
    return beforeAttributeNameState
  } else if (c === '/') {
    return selfClosingStartTagState
  } else if (c === '>') {
    emit(currnetToken)
    return dataState
  } else if (/^[A-Za-z]$/.test(c)) {
    currnetToken.tagName += c.toLowerCase()
    return tagNameState
  } else {
    currnetToken.tagName += c
    return tagNameState
  }
}

function beforeAttributeNameState(c) {
  if (/^[\t\n\f ]$/.test(c)) {
    return beforeAttributeNameState
  } else if (c === '/' || c === '>') {
    return afterAttributeNameState(c)
  } else {
    currnetAttribute = {
      name: '',
      value: ''
    }
    return attributeNameState(c)
  }
}

function attributeNameState(c) {
  if (/^[\t\n\f />]$/.test(c)) {
    return afterAttributeNameState(c)
  } else if (c === '=') {
    return beforeAttributeValueState
  } else if (/^[A-Za-z]$/.test(c)) {
    currnetAttribute.name += c.toLowerCase()
    return attributeNameState
  } else {
    currnetAttribute.name += c
    return attributeNameState
  }
}

function afterAttributeNameState(c) {
  if (/^[\t\n\f ]$/.test(c)) {
    return afterAttributeNameState
  } else if (c === '/') {
    return selfClosingStartTagState
  } else if (c === '=') {
    return beforeAttributeValueState
  } else if (c === '>') {
    emit(currnetToken)
    return dataState
  } else {
    currnetAttribute = {
      name: '',
      value: ''
    }
    return attributeNameState(c)
  }
}

function beforeAttributeValueState(c) {
  if (/^[\t\n\f ]$/.test(c)) {
    return beforeAttributeValueState
  } else if (c === '"') {
    return attributeValueDoubleQuotedState
  } else if (c === "'") {
    return attributeValueSingleQuotedState
  } else {
    return attributeValueUnquotedState(c)
  }
}

function attributeValueDoubleQuotedState(c) {
  if (c === '"') {
    currnetToken[currnetAttribute.name] = currnetAttribute.value
    return afterAttributeValueQuotedState
  } else {
    currnetAttribute.value += c
    return attributeValueDoubleQuotedState
  }
}

function attributeValueSingleQuotedState(c) {
  if (c === "'") {
    currnetToken[currnetAttribute.name] = currnetAttribute.value
    return afterAttributeValueQuotedState
  } else {
    currnetAttribute.value += c
    return attributeValueSingleQuotedState
  }
}

function afterAttributeValueQuotedState(c) {
  if (/^[\t\n\f ]$/.test(c)) {
    return beforeAttributeNameState
  } else if (c === '/') {
    return selfClosingStartTagState
  } else if (c === '>') {
    emit(currnetToken)
    return dataState
  } else {
    return beforeAttributeNameState(c)
  }
}

function attributeValueUnquotedState(c) {
  if (/^[\t\n\f ]$/.test(c)) {
    currnetToken[currnetAttribute.name] = currnetAttribute.value
    return beforeAttributeNameState
  } else if (c === '>') {
    currnetToken[currnetAttribute.name] = currnetAttribute.value
    emit(currnetToken)
    return dataState
  } else {
    currnetAttribute.value += c
    return attributeValueUnquotedState
  }
}

function selfClosingStartTagState(c) {
 if (c === '>') {
   currnetToken.isSelfClosing = true
   emit(currnetToken)
   return dataState
 } else {
   return beforeAttributeNameState(c)
 }
}

function parseHTML(html) {
  let state = dataState
  for (const c of html) {
    state = state(c)
  }
  state = state(EOF)
  return stack[0]
}

module.exports.parseHTML = parseHTML
