<template>
  <div id="app">
    <a @click="onAuthorize">Login with GitHub</a>
    <Header :repos="repos" @update="onUpdate" />
    <hr />
    <Graphs :repos="reposArray" />
    <hr />
    <Footer />
  </div>
</template>

<script>
import { getAllParam } from '@/lib/params'
import Header from '@/components/Header.vue'
import Graphs from '@/components/Graphs.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Graphs,
    Footer,
  },
  data() {
    return {
      repos: [].concat.apply([], getAllParam('repos').map(repos => {
        const matches = repos.match(/(\w+\/)\{([\S]+)\}/)
        return !matches ? [repos] : matches.slice(2).pop().split(',').map(repo => matches.slice(1, 2) + repo)
      })).filter((value, index, self) => self.indexOf(value) === index),
    }
  },
  methods: {
    onAuthorize() {
      const clientId = import.meta.env.VITE_CLIENT_ID;
      const state = crypto.randomUUID();

      localStorage.setItem("_csrf_token", state);

      window.location.assign(`https://github.com/login/oauth/authorize?client_id=${clientId}&response_type=code&scope=repo&redirect_uri=${window.location.origin}/api/auth&state=${state}`);
    },
    onUpdate(repos) {
      this.repos = repos
    }
  },
  computed: {
    reposArray() {
      return [...this.repos];
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.flex {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
}
.flex-item {
  flex: 0 0 auto;
}
.flex-grow {
  flex-grow: 1;
}
.text-right {
  text-align: right;
}
a {
  color: #2c3e50;
}
.green {
  color: #22da2c;
}
.multiselect__tag, .multiselect__option--highlight, .multiselect__option--highlight:after {
  background-color: #22da2c
}
.red {
  color: #f80808;
}
.multiselect__option--selected.multiselect__option--highlight, .multiselect__option--selected.multiselect__option--highlight:after {
  background-color: #f80808;
}
</style>
