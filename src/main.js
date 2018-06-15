import 'babel-polyfill'
import Vue from 'vue'
import Framework7 from 'framework7/dist/framework7.esm.bundle'
import Framework7Vue from 'framework7-vue'

import 'framework7/dist/css/framework7.min.css'

import OAuth from './components/OAuth'
import store from './store'
import router from './router'

Vue.use(Framework7Vue, Framework7)

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
