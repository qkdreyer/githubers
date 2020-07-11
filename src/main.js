import Vue from 'vue'
import { Octokit } from '@octokit/core'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  data() {
    return {
      octokit: new Octokit({
        auth: this.getParam('token') || process.env.GITHUB_TOKEN
      })
    }
  },
  methods: {
    getParam: param => new URLSearchParams(location.search).get(param),
    getAllParam: param => new URLSearchParams(location.search).getAll(param),
  },
}).$mount('#app')
