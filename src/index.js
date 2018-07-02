import Vue from 'vue'
import Framework7 from './framework7'
import 'framework7/dist/css/framework7.css'
import Framework7Vue from 'framework7-vue'
import 'framework7-icons'
import 'material-design-icons/iconfont/material-icons.css'

import OAuth from './components/OAuth.vue'
import store from './store'
import router from './router'

import './index.css'

Vue.use(Framework7Vue, Framework7)

const theme = 'auto'

const app = new Vue({
  router,
  store,
  framework7: {
    theme
  }
})
app.$mount('#app')

const oauth = new Vue({
  render: h => h(OAuth),
  store,
  framework7: {
    theme
  }
})
oauth.$mount('#oauth')
