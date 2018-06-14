import 'babel-polyfill'
import Vue from 'vue'
import Element from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'

import OAuth from './components/OAuth'
import store from './store'
import router from './router'

Vue.use(Element)

const app = new Vue({
  router,
  store
})
app.$mount('#app')

const oauth = new Vue({
  render: h => h(OAuth),
  router,
  store
})
oauth.$mount('#oauth')
