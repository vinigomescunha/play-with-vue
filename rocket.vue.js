const Rocket = {
  data: () => ({
    arenaWidth: 1000,
    arena: {
      cols: 40,
      rows: 13
    },
    rocket: {
      col: 1,
      row: 1,
      position: POSITIONS.BOTTOM
    },
    blockings: [{
        col: 1,
        row: 2
      },
      {
        col: 4,
        row: 2
      },
      {
        col: 4,
        row: 3
      }
    ],
    editable: false
  }),
  mounted() {
    window.addEventListener('keydown', this.detectKbd);
  },
  destroyed() {
    window.removeEventListener('keydown', this.detectKbd);
  },
  computed: {
    maxRows() {
      return this.arena.rows
    },
    maxCols() {
      return this.arena.cols
    },
    colsWidth() {
      return (this.arenaWidth / this.arena.cols)
    },
    classRocketPosition() {
      return this.rocket.position;
    }
  },
  methods: {
    getCellStyle(row, col) {
      return {
        maxWidth: this.colsWidth + 'px',
        height: this.colsWidth
      }
    },
    isRocketPosition(row, col) {
      return this.rocket.col === col && this.rocket.row === row && !this.rocket.explode
    },
    isBlockingPosition(row, col) {
      return this.blockings.filter(blocking => blocking.col === col && blocking.row === row).length !== 0 && !this.rocket.explode
    },
    isRocketExplosion(row, col) {
      return this.rocket.col === col && this.rocket.row === row && this.rocket.explode
    },
    isCollision() {
      return this.isBlockingPosition(this.rocket.row, this.rocket.col)
    },
    addElement(row, col) {
      if (!this.editable) {
        return;
      }
      if (!this.isBlockingPosition(row, col)) {
        this.blockings.push({
          row,
          col
        })
      }
    },
    detectKbd(e) {
      if (this.rocket.explode) {
        return;
      }
      e = e || window.event;
      const code = (e.keyCode || e.which)
      switch (code) {
        case KEYS.LEFT:
          this.rocket.col = this.rocket.col === 1 ? 1 : Number(this.rocket.col) - 1;
          this.rocket.position = POSITIONS.LEFT;
          break;
        case KEYS.UP:
          this.rocket.row = this.rocket.row === 1 ? 1 : Number(this.rocket.row) - 1;
          this.rocket.position = POSITIONS.UP;
          break;
        case KEYS.RIGHT:
          this.rocket.col = this.rocket.col === this.maxCols ? this.maxCols : Number(this.rocket.col) + 1;
          this.rocket.position = POSITIONS.RIGHT;
          break;
        case KEYS.DOWN:
          this.rocket.row = this.rocket.row === this.maxRows ? this.maxRows : Number(this.rocket.row) + 1;
          this.rocket.position = POSITIONS.BOTTOM;
          break;
      }
      this.rocket.explode = this.isCollision()
      this.forceRerender();
    },
    forceRerender() {
      vm.$forceUpdate();
      this.$nextTick(() => {});
    }
  },
  template: `
    <div class="arena" v-bind:style="{maxWidth: arenaWidth + 'px'}">
    <h1 class="title">Use the arrow keys</h1>
      <div class="row" v-for="row, indexRow of maxRows">
        <div class="cell" v-for="col, indexCol of maxCols" :style="getCellStyle(row, col)" @mousedown="editable=true;addElement(row, col)" @mouseup="editable=false;addElement(row, col)" @mousemove="addElement(row, col)">
          <img class="blocking" draggable="false" v-if="isBlockingPosition(row, col)" src="blocking.png">
          <img class="rocket" draggable="false" v-bind:class="classRocketPosition" v-if="isRocketPosition(row, col)" src="rocket.png">
          <img class="explode" draggable="false" v-if="isRocketExplosion(row, col)" src="explosion.png">
        </div>
      </div>
      <div>
        <button class="restart" 
        v-on:click="rocket.explode = false;rocket.col = 1;rocket.row = 1; rocket.position = POSITIONS.BOTTOM">Restart</button>
        <label class="restart">
          <input type="checkbox" v-model="editable">Add Blockings
        </label>
        <button class="restart" 
        v-on:click="blockings = []">Clear Blockings</button>
      </div>
    </div>
    `
}