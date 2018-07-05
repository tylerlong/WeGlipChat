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
      try {
        await rc.refresh()
      } catch (e) { // refresh token expired
        rc.token(undefined)
        throw e
      }
      return rcRequest(...args)
    }
    throw e
  }
}

const pubnub = new PubNub(rc, ['/restapi/v1.0/glip/posts'], event => {
  switch (event.body.eventType) {
    case 'PostAdded':
      const post = event.body
      store.commit('addPost', post)
      if (getters.isMyself(store.state)(post.creatorId)) {
        break
      }
      if (document.hasFocus() && router.currentRoute.name === 'group' && router.currentRoute.params.id === post.groupId) {
        break
      }
      // show system notification
      Push.create(getters.getPersonNameById(store.state)(post.creatorId) || 'Unknown user', {
        body: getters.getPostPreviewText(store.state)(post),
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

let oldToken
rc.on('tokenChanged', async token => {
  if (R.isNil(token)) { // logout
    Cookies.remove('RINGCENTRAL_TOKEN')
    store.commit('reset')
    router.push({ name: 'login' })
  } else {
    Cookies.set('RINGCENTRAL_TOKEN', token, { expires: 7 })
    if (router.currentRoute.name === 'login' || router.currentRoute.name === null) {
      router.push({ name: 'root' })
    }
    if (R.isNil(oldToken)) {
      store.dispatch('init')
    }
    if (R.isNil(pubnub.subscription())) {
      pubnub.subscribe()
    }
  }
  oldToken = token
})

router.afterEach((to, from) => {
  // for guests, the only available page is the login page
  if (to.name !== 'login' && R.isNil(rc.token())) {
    router.push({ name: 'login' })
  }
  // for users, the only unavailable page is the login page
  if (to.name === 'login' && !R.isNil(rc.token())) {
    router.push({ name: 'root' })
  }
})

rc.token(Cookies.getJSON('RINGCENTRAL_TOKEN'))

export default store
