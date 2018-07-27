import Vue from 'vue'
import Framework7 from './framework7.esm.bundle'
import 'framework7/dist/css/framework7.css'
import Framework7Vue from 'framework7-vue'
import 'framework7-icons'
import 'material-design-icons/iconfont/material-icons.css'
import localforage from 'localforage'
import Cookies from 'js-cookie'
import * as R from 'ramda'

import store from './store'
import router from './router'

import './index.css'

Vue.use(Framework7Vue, Framework7)

let theme = 'ios'

;(async () => {
  if (document.location.search.indexOf('theme=') >= 0) {
    theme = document.location.search.split('theme=')[1].split('&')[0]
  } else {
    const token = Cookies.getJSON('RINGCENTRAL_TOKEN')
    if (!R.isNil(token)) {
      const state = await localforage.getItem(`wgc.${token.owner_id}`)
      if (!R.isNil(state) && !R.isNil(state.config)) {
        theme = state.config.theme || 'ios'
      }
    }
  }
  const app = new Vue({
    router,
    store,
    framework7: {
      theme
    }
  })
  app.$mount('#app')
})()
