function* tokenize(source) {
  const re = /(0|[1-9]\d*)|([ ]+)|([\r\n]+)|([*])|([/])|([+])|([-])|(\()|(\))/g
  const types = ['Number', 'Whitespace', 'LineTerminator', '*', '/', '+', '-', '(', ')']

  let result = null
  let lastIndex = 0
  while (true) {
    lastIndex = re.lastIndex
    result = re.exec(source)
    if (!result) {
      break
    }
    if (re.lastIndex - lastIndex > result[0].length) {
      throw new Error(`Unexpected token "${source.slice(lastIndex, re.lastIndex - result[0].length)}"!`)
    }

    for (let idx = 0; idx < types.length; idx++) {
      if (result[idx + 1]) {
        yield { type: types[idx], value: result[idx + 1] }
        break
      }
    }
  }

  yield { type: 'EOF' }
}

/*
* exp -> add
* add -> mul (('+'|'-') mul)*
* mul -> pri (('*'|'/') pri)*
* pri -> Num | '(' exp ')'
*/

function createAST(tokens) {
  function exp() {
    return add()
  }

  function add() {
    let astNode = mul()
    while (tokens.length > 1 && /^[+-]$/.test(tokens[0].type)) {
      astNode = {
        type: tokens.shift().type,
        children: [astNode, mul()]
      }
    }
    return astNode
  }

  function mul() {
    let astNode = pri()
    while (tokens.length > 1 && /^[*/]$/.test(tokens[0].type)) {
      astNode = {
        type: tokens.shift().type,
        children: [astNode, pri()]
      }
    }
    return astNode
  }

  function pri() {
    let astNode = tokens.shift()
    if (astNode.type === 'Number') {
      return astNode
    } else if (astNode.type === '(') {
      astNode = exp()
      if (tokens[0].type === ')') {
        tokens.shift()
        return astNode
      }
    }
    throw TypeError('Unexpected Token Type')
  }

  return exp()
}

function calcul(ast) {
  if (ast.value !== void(0)) {
    return +ast.value
  }
  const [value1, value2] = ast.children.map(c => calcul(c))

  return eval(`${value1} ${ast.type} ${value2}`)
}

function calculator(input) {
  const tokens = [...tokenize(input)].filter(t => !['Whitespace', 'LineTerminator'].includes(t.type))
  const ast = createAST(tokens)
  console.log(JSON.stringify(ast, null, 2))
  return calcul(ast)
}

const input = '(3 * 5 - 5) * (92 / (4 + 4))'
console.log(`input: ${input} \nresult: ${calculator(input)}`)
