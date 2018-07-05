<template>
  <f7-popup :opened="loginModalVisible">
    <f7-page>
      <f7-navbar title="Log In">
      </f7-navbar>
      <f7-block>
        <iframe v-if="loginModalVisible" :src="oauthUri" width="100%" height="600" frameborder="0"></iframe>
      </f7-block>
    </f7-page>
  </f7-popup>
</template>

<script>
import URI from 'urijs'
import { mapState } from 'vuex'
import { f7Popup, f7Page, f7Navbar, f7Block } from 'framework7-vue'

import rc from '../api/ringcentral'
import config from '../config'

export default {
  components: {
    f7Popup, f7Page, f7Navbar, f7Block
  },
  computed: {
    oauthUri: function (prompt = true) {
      return rc.oauthUri(prompt)
    },
    ...mapState(['token', 'loginModalVisible'])
  },
  created: function () {
    window.addEventListener('message', async ({ origin, data: { type, redirectUri } }) => {
      if (origin !== window.location.origin || type !== 'REDIRECT_URI') {
        return
      }
      if (redirectUri.indexOf(config.OAUTH_REDIRECT_URI) === -1) {
        return // unexpected uri
      }
      const params = URI(redirectUri.replace('#', '?')).search(true)
      if (params.code === undefined) { // unexpected data
        throw new Error(JSON.stringify(params))
      }
      await rc.authorize({ code: params.code, redirectUri: config.OAUTH_REDIRECT_URI })
      this.$store.commit('setToken', rc.token())
      this.$store.commit('hideLoginModal')
    })
  }
}
</script>
