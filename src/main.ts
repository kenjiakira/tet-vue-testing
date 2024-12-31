import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.config.performance = false

app.config.errorHandler = (err) => {
  console.error('App Error:', err)
}

app.mount('#app')
