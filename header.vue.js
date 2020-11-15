var Header = {
  created() {
    this.$root.$router.options.routes.forEach(route => {
      this.items.push({
        name: route.name,
        path: route.path
      })
    })
  },
  data: () => {
    return {
      items: []
    }
  },
  template: `
    <nav style="background-color: #ddffee;">
      <div>
        <ul class="header-links">
          <li class="header-link" v-for="item in items">
            <router-link class="nav-link" :to="item.path">
              {{item.name}}
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
};