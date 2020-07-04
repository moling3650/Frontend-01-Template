class Trie {
  constructor() {
    this.root = {}
  }

  insert(word) {
    let node = this.root
    for (const c of word) {
      if (!node[c]) {
        node[c] = {}
      }
      node = node[c]
    }
    node['$'] = node['$'] ? node['$'] + 1 : 1
  }

  most () {
    let max = 0
    let maxWord = ''
    const visit = (node, word) => {
      if (node.$ > max) {
        max = node.$
        maxWord = word
      }
      Object.entries(node).forEach(([c, n]) => {
        if (c !== '$') {
          visit(n, word + c)
        }
      })
    }
    visit(this.root, '')
    console.log(max, maxWord)
  }
}

function randomWord(length) {
  let s = ''
  for (let i = 0; i < length; i++) {
    s += String.fromCharCode('a'.charCodeAt(0) + Math.random() * 26)
  }
  return s
}

const t = new Trie()
for (let index = 0; index < 10000; index++) {
  t.insert(randomWord(4))
}
t.most()
