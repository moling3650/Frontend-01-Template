function matchByClassSelector(selector, element) {
  return element.className === selector.replace('.', '')
}
