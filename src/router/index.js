import Vue from 'vue'
import VueRouter from 'vue-router'
import { isNil } from 'ramda'

import App from '../components/App.vue'
import Login from '../components/Login.vue'
import Settings from '../components/Settings.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'root', component: App },
  { path: '/login/', name: 'login', component: Login },
  { path: '/settings/', name: 'settings', component: Settings }
]
const router = new VueRouter({ routes })

// redirect to the route before login
let routeBeforeLogin = 'root'
router.afterEach((to, from) => {
  if (to.name === 'login' && !isNil(from.name) && from.name !== 'login') {
    routeBeforeLogin = from.name
  }
})
router.redirectAfterLogin = () => {
  router.push({ name: routeBeforeLogin })
}

export default router
