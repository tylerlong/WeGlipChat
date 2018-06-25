import Vue from 'vue'
import Vuex from 'vuex'
import * as R from 'ramda'
import Cookies from 'js-cookie'
import delay from 'timeout-as-promise'
import multipartMixedParser from 'multipart-mixed-parser'

import rc from '../api/ringcentral'
import router from '../router'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: undefined,
    loginModalVisible: false,
    extension: undefined,
    groups: undefined,
    posts: {},
    persons: {}
  },
  getters: {
    getGroupById: state => id => {
      return R.find(g => g.id === id, state.groups || [])
    },
    getPostsByGroupId: state => groupId => {
      return state.posts[groupId]
    },
    isMyself: state => personId => {
      return state.extension && personId === state.extension.id.toString()
    }
  },
  mutations: {
    setPersons (state, persons) {
      for (const person of persons) {
        Vue.set(state.persons, person.id, person)
      }
    },
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
      const r = await rcGet('/restapi/v1.0/account/~/extension/~')
      commit('setExtension', r.data)
    },
    async fetchGroups ({ commit }) {
      const r = await rcGet('/restapi/v1.0/glip/groups', { params: { recordCount: 250 } })
      commit('setGroups', r.data.records)
    },
    async fetchPosts ({ commit, state }, groupId) {
      if (state.posts[groupId]) {
        return // Use data in cache
      }
      const r = await rcGet(`/restapi/v1.0/glip/groups/${groupId}/posts`)
      commit('setPosts', { groupId, posts: r.data.records })
    },
    async fetchPersons ({ commit, state }, personIds) {
      const idsToFetch = R.pipe(
        R.uniq,
        R.filter(id => !(id in state.persons))
      )(personIds)
      for (const ids of R.splitEvery(30, idsToFetch)) {
        const r = await rcGet(`/restapi/v1.0/glip/persons/${ids.join(',')}`)
        const persons = multipartMixedParser.parse(r.data).slice(1).filter(p => 'id' in p)
        commit('setPersons', persons)
      }
    }
  }
})

const rcGet = async (...args) => {
  while (rc.token() === undefined) {
    await delay(1000) // wait for token
  }
  try {
    return await rc.get(...args)
  } catch (e) {
    if (e.response && e.response.status === 401 && e.response.statusText === 'Unauthorized') {
      // token expired
      store.commit('setToken', undefined)
    }
    throw e
  }
}

const tokenCallback = async token => {
  if (!R.isNil(token)) {
    Cookies.set('RINGCENTRAL_TOKEN', token, { expires: 1 / 24 })
    rc.token(token)
    store.dispatch('fetchExtension')
    await store.dispatch('fetchGroups')
    const personIds = R.pipe(
      R.filter(g => g.type === 'PrivateChat' || g.type === 'Group'),
      R.map(g => g.members),
      R.reduce(R.concat, [])
    )(store.state.groups)
    store.dispatch('fetchPersons', personIds)
    if (router.currentRoute.name === 'login' || router.currentRoute.name === null) {
      router.push({ name: 'root' })
    }
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
  if (to.name !== 'login' && (R.isNil(store.state.token) || R.isNil(store.state.token.access_token))) {
    router.push({ name: 'login' })
  }
  // for users, the only unavailable page is the login page
  if (to.name === 'login' && (!R.isNil(store.state.token) && !R.isNil(store.state.token.access_token))) {
    router.push({ name: 'root' })
  }
})

store.commit('setToken', Cookies.getJSON('RINGCENTRAL_TOKEN'))

export default store
