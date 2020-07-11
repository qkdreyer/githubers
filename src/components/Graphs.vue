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
  data: () => ({
    contributors: {},
    githubers: [],
    periodiciy: 52,
  }),
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
      this.githubers = Object.values((await this.get(repos)).reduce((carry, { data, repo }) => {
        data.forEach(({ weeks, author: { login } }) => {
          const slice = weeks.slice(-this.periodiciy)
          if (!carry[login]) {
            carry[login] = {
              weeks: Array(this.periodiciy).fill().map(() => ({
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
            var _a = this.ceil(a)
            var _d = this.ceil(d)

            carry[login].weeks[index].w = w
            carry[login].weeks[index].a += _a
            carry[login].weeks[index].d += _d
            carry[login].weeks[index].c += c
            carry[login].weeks[index].ad += _a + _d

            if (_a > 0) {
              carry[login].weeks[index].raw.a[repo] = _a
            }
            if (_d > 0) {
              carry[login].weeks[index].raw.d[repo] = _d
            }
          })
          carry[login].a += carry[login].weeks.reduce((sum, { a }) => sum + a, 0)
          carry[login].d += carry[login].weeks.reduce((sum, { d }) => sum + d, 0)
          carry[login].ad += carry[login].a + carry[login].d
          carry[login].total += carry[login].weeks.reduce((sum, { c }) => sum + c, 0)
        })
        return carry;
      }, {})).sort((a, b) => a.ad <= b.ad ? 1 : -1).slice(0, 10)
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
    ceil: value => Math.min(value, 100000)
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
.flex {
  padding: 5px;
}
.flex-item {
  margin: 5px;
}
</style>
