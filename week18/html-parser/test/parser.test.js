const { parseHTML } = require('../src/parser.js')
const assert = require('assert')

it('parse a sigle element', () => {
  const doc = parseHTML('<div></div>')
  const element = doc.children[0]
  assert.equal(element.type, 'element')
  assert.equal(element.tagName, 'div')
  assert.equal(element.children.length, 0)
  assert.equal(element.attributes.length, 0)
})

it('parse a sigle element with text', () => {
  const doc = parseHTML('<P>a < b</P>')
  const element = doc.children[0]
  assert.equal(element.tagName, 'P')
  assert.equal(element.children.length, 1)
  assert.equal(element.children[0].type, 'text')
  assert.equal(element.children[0].content, 'a < b')
})

it('parse a sigle element with attributes', () => {
  const doc = parseHTML(`<div  a =10 b= '20'  c="30" />`)
  const element = doc.children[0]
  assert.equal(element.attributes.length, 4)
  assert.equal(element.attributes[0].name, 'a')
  assert.equal(element.attributes[0].value, '10')
  assert.equal(element.attributes[1].name, 'b')
  assert.equal(element.attributes[1].value, '20')
  assert.equal(element.attributes[2].name, 'c')
  assert.equal(element.attributes[2].value, '30')
  assert.equal(element.attributes[3].name, 'isSelfClosing')
  assert.equal(element.attributes[3].value, true)
})

it('parse a sigle element with attributes 2', () => {
  const doc = parseHTML(`<div c="3"/>`)
  const element = doc.children[0]
  assert.equal(element.attributes.length, 2)
})

it('parse a sigle element with attributes 3', () => {
  const doc = parseHTML(`<div c="3"></div>`)
  const element = doc.children[0]
  assert.equal(element.attributes.length, 1)
})

it('parse a sigle element with attributes 4', () => {
  const doc = parseHTML(`<div a b></div>`)
  const element = doc.children[0]
  assert.equal(element.attributes.length, 2)
  assert.equal(element.attributes[0].name, 'a')
  assert.equal(element.attributes[1].name, 'b')
})

it('parse a sigle element with attributes 5', () => {
  const doc = parseHTML(`<div a=10></div>`)
  const element = doc.children[0]
  assert.equal(element.attributes.length, 1)
  assert.equal(element.attributes[0].name, 'a')
  assert.equal(element.attributes[0].value, '10')
})

it('parse a sigle element with attributes 6', () => {
  const doc = parseHTML(`<div a=10/>`)
  const element = doc.children[0]
  assert.equal(element.attributes.length, 2)
})

it('missing whitespace between attributes', () => {
  try {    
    const doc = parseHTML('<div id="Id"class="cls"></div>')
  } catch (error) {
    assert.equal(error.message, 'missing-whitespace-between-attributes parse error')
  }
})

it('tag mismatch', () => {
  try {    
    const doc = parseHTML('<h1></h2>')
  } catch (error) {
    assert.equal(error.message, 'Tag start end doesn\'t match!')
  }
})

it('self closing start tag', () => {
  const doc = parseHTML('<br/>')
  const element = doc.children[0]
  assert.equal(element.attributes.length, 1)
  assert.equal(element.attributes[0].name, 'isSelfClosing')
  assert.equal(element.attributes[0].value, true)
})

it('missing end tag name', () => {
  try {
    const doc = parseHTML('<h1></>')
  } catch (error) {
    assert.equal(error.message, 'missing-end-tag-name parse error')
  }
})

it('invalid first character of tag name', () => {
  try {
    const doc = parseHTML('<h1></*>')
  } catch (error) {
    assert.equal(error.message, 'invalid-first-character-of-tag-name parse error')
  }
})