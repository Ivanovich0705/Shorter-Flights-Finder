import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import * as d3 from 'd3'
import { queue } from 'd3-queue'
//import './assets/main.css'
import chart from './components/chart.vue'
const app = createApp(App)

app.use(router)
app.component('d3', d3)
app.component('chart', chart)
app.mount('#app')
