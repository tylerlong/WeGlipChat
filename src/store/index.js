import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    loginModalVisible: false
  },
  getters: {
    authorized: state => state.token !== null && state.token.access_token !== undefined,
    accessToken: state => state.token === null ? null : state.token.access_token
  },
  mutations: {
    setToken (state, token) {
      state.token = token
    },
    showLoginModal (state) {
      state.loginModalVisible = true
    },
    hideLoginModal (state) {
      state.loginModalVisible = false
    }
  }
})
