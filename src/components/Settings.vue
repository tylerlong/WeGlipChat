<template>
  <f7-page :page-content="false">
    <tabs active="settings"></tabs>
    <p>Welcome<span v-if="extension"> {{ extension.name }}</span>!</p>
    <f7-button fill v-if="token" @click="logOut">Log Out</f7-button>
  </f7-page>
</template>

<script>
import { mapState } from 'vuex'
import { f7Button, f7Page } from 'framework7-vue'

import Tabs from './Tabs.vue'

export default {
  components: {
    f7Button, f7Page, Tabs
  },
  computed: {
    ...mapState(['token', 'extension'])
  },
  methods: {
    logOut: function () {
      this.$store.commit('setToken', undefined)
    }
  }
}
</script>
