<template>
  <f7-page :page-content="false">
    <tabs active="settings"></tabs>
    <div class="page-content">
      <div class="settings-content">
        <p>Welcome<span v-if="extension"> {{ extension.name }}</span>!</p>
        <p>Enable desktop notification:
          <label class="toggle">
            <input type="checkbox" v-model="enableNotifications">
            <span class="toggle-icon"></span>
          </label>
        </p>
        <p>Theme:
          <f7-radio
            name="theme"
            value="auto"
            :checked="theme === 'auto' || theme === undefined"
            @change="theme = $event.target.value"
          ></f7-radio> Auto |
          <f7-radio
            name="theme"
            value="md"
            :checked="theme === 'md'"
            @change="theme = $event.target.value"
          ></f7-radio> Material Design |
          <f7-radio
            name="theme"
            value="ios"
            :checked="theme === 'ios'"
            @change="theme = $event.target.value"
          ></f7-radio> iOS
        </p>
      </div>
      <p><f7-button color="green" fill v-if="loggedIn" @click="logOut">Log Out</f7-button></p>
    </div>
  </f7-page>
</template>

<script>
import { mapState } from 'vuex'
import { f7Button, f7Page, f7Radio } from 'framework7-vue'
import * as R from 'ramda'

import Tabs from './Tabs.vue'
import rc from '../api/ringcentral'

export default {
  components: {
    f7Button, f7Page, f7Radio, Tabs
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
    },
    theme: {
      get () {
        return this.$store.state.config.theme
      },
      set (value) {
        this.$store.commit('setTheme', value)
        window.location.reload(false)
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
