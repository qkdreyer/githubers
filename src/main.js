import Vue from 'vue'
import { Octokit } from '@octokit/core'
import App from './App.vue'
import params from './lib/params'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  mixins: [params],
  data() {
    return {
      octokit: new Octokit({
        auth: this.getParam('token') || process.env.GITHUB_TOKEN
      }),
    }
  },
}).$mount('#app')
