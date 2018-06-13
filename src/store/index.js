import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null
  },
  getters: {
    authorized: state => state.token !== null,
    accessToken: state => state.token === null ? null : state.token.access_token
  },
  mutations: {
    setToken (state, token) {
      state.token = token
    }
  }
})
