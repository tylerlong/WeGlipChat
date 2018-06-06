import Vue from 'vue'

import App from './App'

global.app = new Vue({
  el: '#app',
  render: h => h(App)
})
