<template>
  <div class="flex">
    <Graph v-for="(githuber, index) in githubers" :key="index" :index="index" :githuber="githuber" />
  </div>
</template>

<script>
import Graph from './Graph.vue'

export default {
  name: 'Graphs',
  components: {
    Graph,
  },
  props: {
    repo: String,
  },
  data: () => ({
    githubers: [],
  }),
  mounted() {
    if (this.repo) {
      this.search(this.repo)
    }
  },
  watch: {
    repo(repo) {
      this.search(repo)
    },
  },
  methods: {
    async search(repo) {
      const { data } = await this.$root.octokit.request('GET /repos/{owner}/{repo}/stats/contributors', this.parse(repo))
      this.githubers = data.map(({ weeks, author: { login }, ...data }) => {
        const slice = weeks.slice(-52)
        return {
          ...data,
          weeks: slice.map(({ ...data }) => ({ ad: data.a + data.d, ...data })),
          a: slice.reduce((sum, { a }) => sum + a, 0),
          d: slice.reduce((sum, { d }) => sum + d, 0),
          total: slice.reduce((sum, { c }) => sum + c, 0),
          login,
        }
      }).sort((a, b) => a.a + a.d <= b.a + b.d ? 1 : -1).slice(0, 10)
    },
    parse(repository) {
      const [owner, repo] = repository.split('/')
      return {
        owner: repo ? owner : this.$root.getParam('owner') || 'qkdreyer',
        repo: repo || owner,
      }
    },
  },
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
