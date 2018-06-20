import Vue from 'vue'
import Vuex from 'vuex'
import { isNil, find } from 'ramda'
import Cookies from 'js-cookie'

import rc from '../api/ringcentral'
import router from '../router'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: undefined,
    loginModalVisible: false,
    extension: undefined,
    groups: undefined,
    posts: {}
  },
  getters: {
    getGroupById: state => id => {
      return find(g => g.id === id, state.groups)
    },
    getPostByGroupId: state => groupId => {
      return state.posts[groupId]
    }
  },
  mutations: {
    setPosts (state, { groupId, posts }) {
      Vue.set(state.posts, groupId, posts)
    },
    setGroups (state, groups) {
      state.groups = groups
    },
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
    },
    async fetchGroups ({ commit }) {
      const r = await rc.get('/restapi/v1.0/glip/groups')
      commit('setGroups', r.data.records)
    },
    async fetchPosts ({ commit }, groupId) {
      const r = await rc.get(`/restapi/v1.0/glip/groups/${groupId}/posts`)
      commit('setPosts', { groupId, posts: r.data.records })
    }
  }
})

const tokenCallback = token => {
  if (!isNil(token)) {
    Cookies.set('RINGCENTRAL_TOKEN', token, { expires: 1 / 24 })
    rc.token(token)
    store.dispatch('fetchExtension')
    store.dispatch('fetchGroups')
    router.redirectAfterLogin()
  } else {
    Cookies.remove('RINGCENTRAL_TOKEN')
    rc.token(undefined)
    store.commit('setExtension', undefined)
    router.push({ name: 'login' })
  }
}
store.watch(state => state.token, tokenCallback)

router.afterEach((to, from) => {
  // for guests, the only available page is the login page
  if (to.name !== 'login' && (isNil(store.state.token) || isNil(store.state.token.access_token))) {
    router.push({ name: 'login' })
  }
  // for users, the only unavailable page is the login page
  if (to.name === 'login' && (!isNil(store.state.token) && !isNil(store.state.token.access_token))) {
    router.redirectAfterLogin()
  }
})

store.commit('setToken', Cookies.getJSON('RINGCENTRAL_TOKEN'))

export default store
