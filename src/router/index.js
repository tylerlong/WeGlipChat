import Vue from 'vue'
import VueRouter from 'vue-router'

import App from '../components/App.vue'
import Login from '../components/Login.vue'
import Settings from '../components/Settings.vue'
import ContactList from '../components/ContactList.vue'
import GroupPage from '../components/GroupPage.vue'
import PersonPage from '../components/PersonPage.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/glip/', name: 'root', component: App },
  { path: '/login/', name: 'login', component: Login },
  { path: '/settings/', name: 'settings', component: Settings },
  { path: '/contacts/', name: 'contacts', component: ContactList },
  { path: '/group/:id', name: 'group', component: GroupPage },
  { path: '/person/:id', name: 'person', component: PersonPage }
]
const router = new VueRouter({ routes })

export default router
