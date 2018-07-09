<template>
  <f7-page :page-content="false">
    <tabs active="settings"></tabs>
    <div class="page-content">
      <div class="settings-content">
        <p>Welcome<span v-if="extension"> {{ extension.name }}</span>!</p>
        Enable desktop notification
        <label class="toggle">
          <input type="checkbox" v-model="enableNotifications">
          <span class="toggle-icon"></span>
        </label>
      </div>
      <p><f7-button color="green" fill v-if="loggedIn" @click="logOut">Log Out</f7-button></p>
    </div>
  </f7-page>
</template>

<script>
import { mapState } from 'vuex'
import { f7Button, f7Page } from 'framework7-vue'
import * as R from 'ramda'

import Tabs from './Tabs.vue'
import rc from '../api/ringcentral'

export default {
  components: {
    f7Button, f7Page, Tabs
  },
  computed: {
    ...mapState(['extension']),
    loggedIn: function () {
      return !R.isNil(rc.token())
    },
    enableNotifications: {
      get () {
        return this.$store.state.config.enableNotifications
      },
      set (value) {
        this.$store.commit('setEnableNotifications', value)
      }
    }
  },
  methods: {
    logOut: function () {
      rc.revoke()
    }
  }
}
</script>
