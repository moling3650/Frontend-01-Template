class MapUI {
  constructor(board, selector = '#container', opts) {
    this.board = board
    this.dim = this.board.getDimension()
    this.containerEl = document.querySelector(selector)
    this.isMouseDown = false
    this.isClear = false
    this._initEvents()
    this._initDOM(opts)
  }

  _initEvents() {
    document.addEventListener('contextmenu', e => e.preventDefault())
    document.addEventListener('mouseup', () => {
      this.isMouseDown = false
    })
  }

  _initDOM(opts) {
    const { cellSize = 7, cellBorderWidth = 1 } = opts || {}
    const fragment = document.createDocumentFragment()
    for (let pos = 0; pos < this.board.cells.length; pos++) {
      const el = document.createElement('DIV')
      el.style.width = `${cellSize}px`
      el.style.height = `${cellSize}px`
      el.style.border = `${cellBorderWidth}px solid #fff`
      el.style.backgroundColor = this.board.cells[pos] ? '#333' : '#ccc'
      el.classList.add('cell')
      el.addEventListener('mousedown', e => {
        this.isMouseDown = true
        this.isClear = (e.which === 3)
        this._drawCell(el, pos)
      })
      el.addEventListener('mouseover', () => {
        this._drawCell(el, pos)
      })
      fragment.appendChild(el)
    }
    this.containerEl.style.width = `${(cellSize + cellBorderWidth * 2) * this.dim}px`
    this.containerEl.appendChild(fragment)
  }

  _drawCell(el, pos) {
    if (this.isMouseDown) {
      if (this.isClear) {
        el.style.backgroundColor = '#ccc'
        this.board.cells[pos] = 0
      } else {
        el.style.backgroundColor = '#333'
        this.board.cells[pos] = -1
      }
    }
  }

  _draw () {
    const range = new Range()
    range.selectNodeContents(this.containerEl)
    const fragment = range.extractContents()
    Array.from(fragment.childNodes).forEach((el, pos) => {
      el.style.backgroundColor = this.board.cells[pos] ? '#333' : '#ccc'
    })

    this.containerEl.appendChild(fragment)
  }

  async sleep (timeout) {
    return new Promise(function (resolve) {
      setTimeout(resolve, timeout)
    })
  }

  getPositionFor({ x, y }) {
    return y * this.dim + x
  }

  async findPath(start, end) {
    this.containerEl.children[this.getPositionFor(end)].style.backgroundColor = 'red'
    const map = this.board.clone()
    const queue = [start]
    map.cells[this.getPositionFor(start)] = 1

    const insert = async ({ x, y }, distance) => {
      if (x < 0 || y < 0 || x >= this.dim || y >= this.dim) {
        return
      }
      const pos = this.getPositionFor({ x, y })
      if (map.cells[pos] === -1) {
        return
      }
      if (map.cells[pos] !== 0) {
        return
      }
      map.cells[pos] = distance + 1
      this.containerEl.children[pos].style.backgroundColor = 'lightgreen'
      await this.sleep(5)
      queue.push({ x, y })
    }

    while (queue.length) {
      const { x, y } = queue.shift()
      if (x === end.x && y === end.y) {
        await this.getBestPath(map.cells, end)
        return true
      }

      const distance = map.cells[this.getPositionFor({ x, y })]
      await insert({ x: x - 1, y }, distance)
      await insert({ x: x + 1, y }, distance)
      await insert({ x, y: y + 1 }, distance)
      await insert({ x, y: y - 1 }, distance)
    }

    return false
  }

  async getBestPath(map, end) {
    let curr = end
    do {
      const pos = this.getPositionFor(curr)
      const distance = map[pos]
      this.containerEl.children[pos].style.backgroundColor = 'red'
      if (distance === 1) {
        break
      }
      const prevList = [
        { x: curr.x - 1, y: curr.y },
        { x: curr.x + 1, y: curr.y },
        { x: curr.x, y: curr.y + 1 },
        { x: curr.x, y: curr.y - 1 }
      ]
      for (const p of prevList) {
        if (p.x < 0 || p.y < 0 || p.x >= this.dim || p.y >= this.dim) {
          continue
        }
        if (map[this.getPositionFor(p)] === (distance - 1)) {
          curr = p
          break
        }
      }

    } while (true)
  }

  clear() {
    this.board.clear()
    this._draw()
  }

  save() {
    localStorage.setItem('map', JSON.stringify(this.board.cells))
  }
}
