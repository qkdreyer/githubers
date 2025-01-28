import { createApp } from 'vue'
import App from '@/App.vue'

if (location.search.length === 0)
  location.search = '?repos=vuejs/core&repos=vitejs/vite&weeks=52'

createApp(App).mount('#app')
