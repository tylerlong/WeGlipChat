import Vue from 'vue'
import 'framework7-icons'
import 'material-design-icons/iconfont/material-icons.css'

import store from './store'
import router from './router'

import './index.css'

const app = new Vue({
  router,
  store
})
app.$mount('#app')
