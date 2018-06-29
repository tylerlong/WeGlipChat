import Vue from 'vue'
import Vuex from 'vuex'
import * as R from 'ramda'
import Cookies from 'js-cookie'

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

const tokenCallback = async token => {
  if (!R.isNil(token)) {
    Cookies.set('RINGCENTRAL_TOKEN', token, { expires: 1 / 24 })
    rc.token(token)
    if (router.currentRoute.name === 'login' || router.currentRoute.name === null) {
      router.push({ name: 'root' })
    }
    store.dispatch('fetchExtension')
    await store.dispatch('fetchGroups')
    const personIds = R.pipe(
      R.filter(g => g.type === 'PrivateChat' || g.type === 'Group'),
      R.map(g => g.members),
      R.reduce(R.concat, [])
    )(store.state.groups)
    store.dispatch('fetchPersons', personIds)
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
