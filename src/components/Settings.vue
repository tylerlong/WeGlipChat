<template>
  <f7-page :page-content="false">
    <tabs active="settings"></tabs>
    <div class="page-content">
      <p>Welcome<span v-if="extension"> {{ extension.name }}</span>!</p>
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
    }
  },
  methods: {
    logOut: function () {
      rc.revoke()
    }
  }
}
</script>
