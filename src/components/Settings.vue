<template>
  <div class="page">
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

      <div class="block-title">Theme</div>
      <div class="list">
        <ul>
          <li>
            <label class="item-radio item-content">
              <input type="radio" name="theme" value="auto" :checked="theme === 'auto'" @change="theme = $event.target.value"/>
              <i class="icon icon-radio"></i>
              <div class="item-inner">
                <div class="item-title">Auto</div>
              </div>
            </label>
          </li>
          <li>
            <label class="item-radio item-content">
              <input type="radio" name="theme" value="ios" :checked="theme === 'ios' || theme === undefined" @change="theme = $event.target.value"/>
              <i class="icon icon-radio"></i>
              <div class="item-inner">
                <div class="item-title">iOS</div>
              </div>
            </label>
          </li>
          <li>
            <label class="item-radio item-content">
              <input type="radio" name="theme" value="md" :checked="theme === 'md'" @change="theme = $event.target.value"/>
              <i class="icon icon-radio"></i>
              <div class="item-inner">
                <div class="item-title">Material Design</div>
              </div>
            </label>
          </li>
        </ul>
      </div>

      <p>
        <button class="button button-fill color-green" v-if="loggedIn" @click="logOut">Log Out</button>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as R from 'ramda'

import Tabs from './Tabs.vue'
import rc from '../api/ringcentral'

export default {
  components: {
    Tabs
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
