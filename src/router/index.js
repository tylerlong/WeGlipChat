import Vue from 'vue'
import VueRouter from 'vue-router'
import { isNil } from 'ramda'

import App from '../components/App.vue'
import Login from '../components/Login.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'root', component: App },
  { path: '/login/', name: 'login', component: Login }
]
const router = new VueRouter({ routes })

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
