import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App'
import Login from './components/Login'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: App },
  { path: '/login/', component: Login }
]
const router = new VueRouter({ routes })

const vue = new Vue({ router })
vue.$mount('#app')
