import { createApp } from 'vue'
import App from '@/App.vue'
import params from '@/lib/params'

createApp(App, {
  mixins: [params],
  data() {
    return {
      octokit: new Octokit({
        auth: this.getParam('token')
      }),
    }
  },
}).mount('#app')
