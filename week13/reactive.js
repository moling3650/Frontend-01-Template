const usedReactivities = []
const reactiveMap = new Map()
const handlerMap = new Map()

function reactive(obj) {
  if (reactiveMap.has(obj)) {
    return reactiveMap.get(obj)
  }

  const proxy = new Proxy(obj, {
    get (obj, prop) {
      usedReactivities.push({ obj, prop })
      if (typeof obj[prop] === 'object') {
        return reactive(obj[prop])
      }
      return obj[prop]
    },
    set(obj, prop, val) {
      obj[prop] = val
      if (handlerMap.has(obj) && handlerMap.get(obj).has(prop)) {
        for (const handler of handlerMap.get(obj).get(prop)) {
          handler()
        }
      }
      return obj[prop]
    }
  })

  reactiveMap.set(obj, proxy)
  reactiveMap.set(proxy, proxy)
  return proxy
}

function effect(handler) {
  usedReactivities.length = 0
  handler()
  for (const { obj, prop } of usedReactivities) {
    if (!handlerMap.has(obj)) {
      handlerMap.set(obj, new Map())
    }
    if (!handlerMap.get(obj).has(prop)) {
      handlerMap.get(obj).set(prop, [])
    }
    handlerMap.get(obj).get(prop).push(handler)
  }
}


let v12, v1, v2

const p1 = reactive({ a: 1 })
const p2 = reactive({ a: 1 })

effect(() => v12 = p1.a + p2.a)
effect(() => v1 = p1.a)
effect(() => v2 = p2.a)

console.log(`${v1} + ${v2} = ${v12}`)
p1.a = 2
console.log(`${v1} + ${v2} = ${v12}`)
p2.a = 3
console.log(`${v1} + ${v2} = ${v12}`)
