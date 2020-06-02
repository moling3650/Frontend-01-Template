function matchByClassSelector(selector, element) {
  return element.className.split(/\s+/g).includes(selector.replace('.', ''))
}
