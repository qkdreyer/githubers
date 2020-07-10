<template>
  <div id="app">
    <Header :repo="repo" @change="onChange" />
    <hr />
    <Graphs :repo="repo" />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Graphs from './components/Graphs.vue'

export default {
  name: 'App',
  components: {
    Header,
    Graphs,
  },
  data() {
    console.log(this.$root.getParam('repo'))
    return {
      repo: this.$root.getParam('repo'),
    }
  },
  methods: {
    onChange(repo) {
      this.repo = repo
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
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}
</style>
