import 'babel-polyfill'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Element from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'

import App from './App'
import Login from './components/Login'
import OAuth from './components/OAuth'
import store from './store'

Vue.use(VueRouter)
Vue.use(Element)

const routes = [
  { path: '/', component: App },
  { path: '/login/', component: Login }
]
const router = new VueRouter({ routes })

const app = new Vue({
  router,
  store
})
app.$mount('#app')

const oauth = new Vue({
  render: h => h(OAuth),
  store
})
oauth.$mount('#oauth')
