import Vue from 'vue'
import Vuex from 'vuex'
import * as R from 'ramda'
import Cookies from 'js-cookie'
import PubNub from 'ringcentral-js-concise/src/pubnub'
import Push from 'push.js'

import rc from '../api/ringcentral'
import router from '../router'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'
import { initialState } from './state'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: initialState,
  getters,
  mutations,
  actions
})

const rcRequest = rc.request.bind(rc)
rc.request = async (...args) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log(...args)
    }
    return await rcRequest(...args)
  } catch (e) {
    if (e.response && e.response.status === 401 && e.response.statusText === 'Unauthorized') {
      store.commit('setToken', undefined) // token expired
    }
    throw e
  }
}

const pubnub = new PubNub(rc, ['/restapi/v1.0/glip/posts'], event => {
  switch (event.body.eventType) {
    case 'PostAdded':
      const post = event.body
      store.commit('addPost', post)
      Push.create(getters.getPersonNameById(store.state)(post.creatorId), {
        body: post.text,
        icon: getters.getPersonAvatar(store.state)(post.creatorId),
        timeout: 4000,
        onClick: function () {
          window.focus()
          this.close()
          router.push({ name: 'group', params: { id: post.groupId } })
        }
      })
      break
    default:
      break
  }
})
const tokenCallback = async token => {
  if (!R.isNil(token)) {
    Cookies.set('RINGCENTRAL_TOKEN', token, { expires: 1 / 24 })
    rc.token(token)
    if (router.currentRoute.name === 'login' || router.currentRoute.name === null) {
      router.push({ name: 'root' })
    }
    store.dispatch('init')
    pubnub.subscribe()
  } else {
    Cookies.remove('RINGCENTRAL_TOKEN')
    rc.token(undefined)
    store.commit('reset')
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
