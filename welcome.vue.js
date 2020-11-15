const Welcome = {
  computed: {
    maxWidth () {
      return 1000;
    }
  },
  template: `
    <div v-bind:style="{maxWidth: maxWidth + 'px', margin: '0 auto'}">
      <h1 class="title">Welcome to Vue Example.</h1>
      Lorem ipsum dolor sit amet, lorem ipsum dolor aqucia sit amet [...]
    </div>
    `
};