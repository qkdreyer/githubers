<template>
  <div id="app">
    <Header :repos="repos" @change="onChange" />
    <hr />
    <Graphs :repos="repos" />
    <hr />
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Graphs from './components/Graphs.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Graphs,
    Footer,
  },
  data() {
    return {
      repos: this.$root.getAllParam('repos'),
    }
  },
  methods: {
    onChange(repos) {
      this.repos = repos
    }
  }
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
  color: green;
}
.red {
  color: red;
}
</style>
