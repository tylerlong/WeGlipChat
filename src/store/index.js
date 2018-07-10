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
  actions,
  strict: process.env.NODE_ENV !== 'production'
})

const rcRequest = rc.request.bind(rc)
rc.request = async (config) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log(new Date() + '\n' + JSON.stringify(config, null, 2))
    }
    return await rcRequest(config)
  } catch (e) {
    if (e.response && R.any(error => R.test(/\btoken\b/i, error.message), e.response.data.errors)) {
      try {
        await rc.refresh() // access token expired, try to refresh it
      } catch (e) {
        if (e.response && R.any(error => R.test(/\btoken\b/i, error.message), e.response.data.errors)) {
          rc.token(undefined) // refresh token expired, then token is useless
        }
        throw e
      }
      return rcRequest(config)
    }
    throw e
  }
}

const pubnub = new PubNub(rc, ['/restapi/v1.0/glip/posts', '/restapi/v1.0/glip/groups'], event => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(event.body.eventType)
  }
  switch (event.body.eventType) {
    case 'PostAdded':
      const post = event.body
      store.dispatch('addPost', post)
      if (getters.isMyself(store.state)(post.creatorId)) {
        break
      }
      if (document.hasFocus() && router.currentRoute.name === 'group' && router.currentRoute.params.id === post.groupId) {
        break
      }
      // show system notification
      if (store.state.config.enableNotifications) {
        let who = getters.getPersonNameById(store.state)(post.creatorId) || 'Unknown user'
        const group = getters.getGroupById(store.state)(post.groupId)
        if (!R.isNil(group) && !R.isNil(group.name) && !R.isEmpty(group.name)) {
          who += ` in ${group.name}`
        }
        Push.create(who, {
          body: getters.getPostPreviewText(store.state)(post),
          icon: getters.getPersonAvatar(store.state)(post.creatorId),
          timeout: process.env.NODE_ENV === 'production' ? 4000 : 16000,
          requireInteraction: process.env.NODE_ENV !== 'production',
          onClick: function () {
            window.focus()
            this.close()
            router.push({ name: 'group', params: { id: post.groupId } })
          }
        })
      }
      break
    case 'GroupJoined':
      store.commit('addGroup', event.body)
      break
    case 'PostChanged':
      store.commit('updatePost', event.body)
      break
    case 'PostRemoved':
      store.commit('removePost', event.body.id)
      break
    case 'GroupLeft':
    case 'GroupChanged':
    default:
      if (process.env.NODE_ENV !== 'production') {
        console.log(JSON.stringify(event.body, null, 2))
      }
      break
  }
})

let inited = false
rc.on('tokenChanged', async token => {
  if (R.isNil(token)) { // logout
    Cookies.remove('RINGCENTRAL_TOKEN')
    store.commit('reset')
    inited = false
    router.push({ name: 'login' })
  } else {
    Cookies.set('RINGCENTRAL_TOKEN', token, { expires: 7 })
    setTimeout(() => {
      if (router.currentRoute.name === 'login' || router.currentRoute.name === null) {
        router.push({ name: 'root' })
      }
    }, 1000) // wait for vue-router to be ready
    if (!inited) {
      inited = true
      await store.dispatch('init', store.subscribe.bind(store))
    }
    if (R.isNil(pubnub.subscription())) {
      pubnub.subscribe()
    }
  }
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
