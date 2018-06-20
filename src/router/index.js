import Vue from 'vue'
import VueRouter from 'vue-router'
import { isNil } from 'ramda'

import App from '../components/App.vue'
import Login from '../components/Login.vue'
import Settings from '../components/Settings.vue'
import Contacts from '../components/Contacts.vue'
import Group from '../components/Group.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/glip/', name: 'root', component: App },
  { path: '/login/', name: 'login', component: Login },
  { path: '/settings/', name: 'settings', component: Settings },
  { path: '/contacts/', name: 'contacts', component: Contacts },
  { path: '/group/:id', name: 'group', component: Group }
]
const router = new VueRouter({ routes })

// redirect to the route before login
let routeBeforeLogin = 'root'
router.afterEach((to, from) => {
  if (to.name === 'login' && !isNil(from.name) && from.name !== 'login' && from.name !== 'settings') {
    routeBeforeLogin = from.name
  }
})
router.redirectAfterLogin = () => {
  router.push({ name: routeBeforeLogin })
}

export default router
