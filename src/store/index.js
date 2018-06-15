import Vue from 'vue'
import Vuex from 'vuex'
import * as R from 'ramda'
import Cookies from 'js-cookie'

import rc from '../api/ringcentral'
import router from '../router'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: undefined,
    loginModalVisible: false,
    extension: undefined
  },
  mutations: {
    setExtension (state, extension) {
      state.extension = extension
    },
    setToken (state, token) {
      state.token = token
    },
    showLoginModal (state) {
      state.loginModalVisible = true
    },
    hideLoginModal (state) {
      state.loginModalVisible = false
    }
  },
  actions: {
    async fetchExtension ({ commit }) {
      const r = await rc.get('/restapi/v1.0/account/~/extension/~')
      commit('setExtension', r.data)
    }
  }
})

const tokenCallback = token => {
  if (!R.isNil(token)) {
    Cookies.set('RINGCENTRAL_TOKEN', token, { expires: 1 / 24 })
    rc.token(token)
    store.dispatch('fetchExtension')
    router.redirectAfterLogin()
  } else {
    Cookies.remove('RINGCENTRAL_TOKEN')
    rc.token(undefined)
    store.commit('setExtension', undefined)
    router.push({ name: 'login' })
  }
}
tokenCallback(undefined) // initial trigger of callback
store.watch(state => state.token, tokenCallback)

store.commit('setToken', Cookies.getJSON('RINGCENTRAL_TOKEN'))

export default store