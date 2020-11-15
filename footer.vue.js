
const Footer = {
    template: `
      <div>
        My Github : {{myGit}}
      </div>`,
  
    data() {
      return { };
    },
    computed: {
      myGit() {
        return this.$root.git;
      }
    },
    mounted() {
      console.log('Footer mounted!')
    }
  };