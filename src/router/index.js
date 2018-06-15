import Vue from 'vue'
import VueRouter from 'vue-router'

import App from '../components/App'
import Login from '../components/Login'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'root', component: App },
  { path: '/login/', name: 'login', component: Login }
]
const router = new VueRouter({ routes })

let routeBeforeLogin = 'root'
router.afterEach((to, from) => {
  if (to.name === 'login' && from.name !== 'login') {
    routeBeforeLogin = from.name
  }
})
router.redirectAfterLogin = () => {
  router.push({ name: routeBeforeLogin })
}

export default router