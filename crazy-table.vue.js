const numCols = 8;
const numRows = 3;
const width = 1000;
const cellBorders = 2;
const url = 'https://source.unsplash.com/random/100x100';
const CrazyTable = {
  data: () => ({
    gridWidth: width + (numCols * cellBorders),
    grid: {
      cols: numCols,
      rows: numRows
    },
    cell: {
      col: 1,
      row: 1
    },
    images: {}
  }),
  mounted() {
    window.addEventListener('keydown', this.detectKbd);
  },
  destroyed() {
    document.querySelector('body').style.backgroundImage = 'none';
    window.removeEventListener('keydown', this.detectKbd);
  },
  computed: {
    maxRows() {
      return this.grid.rows
    },
    maxCols() {
      return this.grid.cols
    },
    colsWidth() {
      return ((this.gridWidth - (numCols * cellBorders)) / this.grid.cols)
    },
  },
  methods: {
    getCellClass(row, col) {
      return this.cell.col === col && this.cell.row === row ? 'selected' : 'not-selected'
    },
    getCellStyle(row, col) {
      return {
        maxWidth: this.colsWidth + 'px',
        height: this.colsWidth,
        border: `${(cellBorders/ 2)}px solid #333`
      }
    },
    getImage(row, col) {
      return this.images && this.images[row] && this.images[row][col] ? this.images[row][col] : ''
    },
    detectKbd(e) {
      e = e || window.event;
      const code = (e.keyCode || e.which)
      switch (code) {
        case KEYS.LEFT:
          this.cell.col = this.cell.col === 1 ? 1 : Number(this.cell.col) - 1
          break;
        case KEYS.UP:
          this.cell.row = this.cell.row === 1 ? 1 : Number(this.cell.row) - 1
          break;
        case KEYS.RIGHT:
          this.cell.col = this.cell.col === this.maxCols ? this.maxCols : Number(this.cell.col) + 1
          break;
        case KEYS.DOWN:
          this.cell.row = this.cell.row === this.maxRows ? this.maxRows : Number(this.cell.row) + 1
          break;
        case KEYS.ENTER:
          this.setImage(this.cell.row, this.cell.col)
          break;
      }
      this.forceRerender();
    },
    forceRerender() {
      this.$forceUpdate();
      this.$nextTick(() => {});
    },
    async setImage(row, col) {
      try {
        const response = await axios.get(url, {
          responseType: "blob",
          timeout: 10000
        })
        const reader = new window.FileReader();
        reader.readAsDataURL(response.data);
        reader.onload = () => {
          const image64 = reader.result;
          if (!this.images[row]) {
            this.images[row] = {}
          }
          this.images[row][col] = image64;
          document.querySelector('body').style.backgroundImage = 'url(' + image64 + ')';
          this.forceRerender()
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  template: `
    <div class="grid" v-bind:style="{maxWidth: gridWidth + 'px'}">
      <h1 class="title">Select the row and press ENTER</h1>
      <div class="row" v-for="row, indexRow of maxRows">
        <div class="cell" 
        v-for="col, indexCol of maxCols" 
        :style="getCellStyle(row, col)" 
        v-bind:class="getCellClass(row, col)">
         <img class="img" v-if="getImage(row, col)" v-bind:src="getImage(row, col)">
        </div>
      </div>
    </div>
    `
}