// src/main.js
import { createApp } from 'vue'
import { Quasar, Notify } from 'quasar'
import App from './App.vue'
import router from './router'
import pinia from './plugins/pinia'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Quasar, {
  plugins: { Notify },
})

app.mount('#app')
