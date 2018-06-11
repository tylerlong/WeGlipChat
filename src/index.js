import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: App }
]
const router = new VueRouter({ routes })

const vue = new Vue({ router })
vue.$mount('#app')
