<template>
  <div class="flex">
    <div class="flex-item flex-grow" v-for="(githuber, index) in githubers" :key="index">
      <Graph :index="index" :githuber="githuber" />
    </div>
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
    repos: Array,
  },
  data() {
    return {
      contributors: {},
      githubers: [],
      periodicity: this.$root.hasParam('weeks') ? Number(this.$root.getParam('weeks')) : 0,
    }
  },
  watch: {
    repos: {
      handler(repos) {
        if (this.repos.length > 0) {
          this.search(repos)
        }
      },
      immediate: true,
    },
  },
  methods: {
    async search(repos) {
      const data = await this.get(repos);
      const max = data.reduce((carry, { data }) => Math.max(carry, data[0].weeks.slice(-this.periodicity).length), 0)
      this.githubers = Object.values(data.reduce((carry, { data, repo }) => {
        data.forEach(({ weeks, author: { login } }) => {
          const slice = weeks.slice(-this.periodicity)
          const offset = max - slice.length
          if (!carry[login]) {
            carry[login] = {
              weeks: Array(max).fill().map(() => ({
                a: 0,
                d: 0,
                c: 0,
                ad: 0,
                raw: {
                  a: {},
                  d: {},
                },
              })),
              a: 0,
              d: 0,
              ad: 0,
              total: 0,
              login,
            }
          }
          slice.forEach(({ w, a, d, c }, index) => {
            const idx = index + offset
            const _a = this.ceil(a)
            const _d = this.ceil(d)

            carry[login].weeks[idx].w = w
            carry[login].weeks[idx].a += _a
            carry[login].weeks[idx].d += _d
            carry[login].weeks[idx].c = c
            carry[login].weeks[idx].ad += _a + _d

            if (_a > 0) {
              carry[login].weeks[idx].raw.a[repo] = _a
            }
            if (_d > 0) {
              carry[login].weeks[idx].raw.d[repo] = _d
            }
          })

          const a = slice.reduce((sum, { a }) => sum + a, 0)
          const d = slice.reduce((sum, { d }) => sum + d, 0)
          carry[login].a += a
          carry[login].d += d
          carry[login].ad += a + d
          carry[login].total += slice.reduce((sum, { c }) => sum + c, 0)
        })
        return carry;
      }, {})).sort((a, b) => console.log(a.ad, b.ad) || a.ad <= b.ad ? 1 : -1).slice(0, this.$root.hasParam('limit') ? Number(this.$root.getParam('limit')) : undefined)
    },
    async get(repos) {
      return await Promise.all(repos.map(async repo => {
        if (!this.contributors[repo]) {
          this.contributors[repo] = await this.$root.octokit.request('GET /repos/{owner}/{repo}/stats/contributors', this.parse(repo))
        }
        return {
          repo,
          ...this.contributors[repo],
        }
      }))
    },
    parse(repository) {
      const [owner, repo] = repository.split('/')
      return {
        owner: repo ? owner : location.hostname.split('.').slice(-2, -1).join(),
        repo: repo || owner,
      }
    },
    ceil: value => Math.min(value, 1000000)
  },
}
</script>

<style scoped>
.flex-item {
  margin: 10px;
  flex: 1 0 200px;
}
</style>
