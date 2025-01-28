<template>
  <div id="app">
    <a v-if="!hasToken" @click="onAuthorize">Login with GitHub</a>
    <Header :repos="repos" @update="onUpdate" />
    <hr />
    <Graphs :repos="reposArray" />
    <hr />
    <Footer />
  </div>
</template>

<script>
import { hasParam, getAllParam } from '@/lib/params'
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
      hasToken: hasParam('token'),
      repos: [].concat.apply([], getAllParam('repos').map(repos => {
        const matches = repos.match(/(\w+\/)\{([\S]+)\}/)
        return !matches ? [repos] : matches.slice(2).pop().split(',').map(repo => matches.slice(1, 2) + repo)
      })).filter((value, index, self) => self.indexOf(value) === index),
    }
  },
  methods: {
    onAuthorize() {
      window.location.assign(new URL(`https://github.com/login/oauth/authorize?${new URLSearchParams({
        client_id: import.meta.env.VITE_CLIENT_ID,
        response_type: 'code',
        scope: 'repo:status',
        redirect_uri: `${window.location.origin}/api/auth`,
        state: window.btoa(window.location.search),
      })}`))
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
