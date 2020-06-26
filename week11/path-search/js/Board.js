const ROAD = 0
class Board {
  constructor(dimension = 10, cells = null) {
    if (cells && Array.isArray(cells)) {
      this.cells = cells.flat()
      this.dimension = Math.sqrt(this.cells.length)
    } else {
      this.dimension = dimension
      this.clear()
    }
  }

  getDimension() {
    return this.dimension
  }

  cellFor(position) {
    this.cells[position]
  }

  clear() {
    this.cells = new Array(this.getDimension() ** 2).fill(ROAD)
  }

  clone() {
    return new Board(null, this.cells)
  }

}
