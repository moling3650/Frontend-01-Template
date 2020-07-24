var parser = require('./parser');

module.exports = function (source, map) {
  const dom = parser.parseHTML(source)
  const template = dom.children.find(node => node.tagName === 'template')
  // const script = dom.children.find(node => node.tagName === 'script')

  function visit(node) {
    if (node.type === 'text') {
      return JSON.stringify(node.content);
    }
    const attrs = {}
    node.attributes.forEach(({ name, value }) => {
      attrs[name] = value;
    })
    const children = node.children.map(c => visit(c)).join(',')

    return `createElement("${node.tagName}", ${JSON.stringify(attrs)}, ${children})`
  }
  
  const target = `
import { createElement } from './createElement';

export default class A {
  setAttribute(name, value) {
    this[name] = value;
  }

  render () {
    return ${visit(template.children.find(node => node.type !== 'text'))};
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }
}`
  return target;
}
