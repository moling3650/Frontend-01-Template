import { enableGesture } from './gusture';

export function createElement(Cls, attributes, ...children) {
  const obj = (typeof Cls === 'string') ? new Element(Cls) : new Cls();

  for (const [name, value] of Object.entries(attributes || {})) {
    obj.setAttribute(name, value);
  }

  const visit = (children) => {
    for (const child of children) {
      if (Array.isArray(child)) {
        visit(child);
      } else if (typeof child === 'string' || typeof child === 'number') {
        obj.appendChild(new Text(child));
      } else {
        obj.appendChild(child);
      }
    }
  }
  visit(children);

  return obj;
}

export class Text {
  constructor(data) {
    this.root = document.createTextNode(data);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

export class Element {
  constructor(tagName) {
    this.root = document.createElement(tagName);
    this.children = [];
  }

  get style() {
    return this.root.style;
  }

  setAttribute(name, value) {
    this[name] = value
    this.root.setAttribute(name, value);

    if (name === 'enableGesture') {
      enableGesture(this.root)
    } else if (name.match(/^on(.+)$/)) {
      const eventName = RegExp.$1.toLocaleLowerCase();
      this.addEventListener(eventName, value)
    }
  }

  appendChild(child) {
    this.children.push(child);
  }

  addEventListener() {
    this.root.addEventListener(...arguments);
  }

  mountTo(parent) {
    for (let child of this.children) {
      child.mountTo(this.root);
    }
    parent.appendChild(this.root);
  }
}
