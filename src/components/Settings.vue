<template>
  <f7-page :page-content="false">
    <tabs active="settings"></tabs>
    <div class="page-content">
      <h3>Welcome<span v-if="extension"> {{ extension.name }}</span>!</h3>
      <div class="list simple-list">
        <ul>
          <li>
            <span>Desktop notification</span>
            <label class="toggle">
              <input type="checkbox" v-model="enableNotifications">
              <span class="toggle-icon"></span>
            </label>
          </li>
        </ul>
      </div>
      <f7-block-title>Theme</f7-block-title>
      <f7-list>
        <f7-list-item radio
          name="theme"
          value="auto"
          :checked="theme === 'auto' || theme === undefined"
          @change="theme = $event.target.value"
          title="Auto"
        ></f7-list-item>
        <f7-list-item radio
          name="theme"
          value="md"
          :checked="theme === 'md'"
          @change="theme = $event.target.value"
          title="Material Design"
        ></f7-list-item>
        <f7-list-item radio
          name="theme"
          value="ios"
          :checked="theme === 'ios'"
          @change="theme = $event.target.value"
          title="iOS"
        ></f7-list-item>
      </f7-list>
      <p><f7-button color="green" fill v-if="loggedIn" @click="logOut">Log Out</f7-button></p>
    </div>
  </f7-page>
</template>

<script>
import { mapState } from 'vuex'
import { f7Button, f7Page, f7BlockTitle, f7List, f7ListItem } from 'framework7-vue'
import * as R from 'ramda'

import Tabs from './Tabs.vue'
import rc from '../api/ringcentral'

export default {
  components: {
    f7Button, f7Page, f7BlockTitle, f7List, f7ListItem, Tabs
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
        setTimeout(() => {
          window.location.reload(false)
        }, 100) // wait for localforage writing
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
