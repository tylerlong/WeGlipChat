<template>
  <el-dialog title="Log In" :visible="loginModalVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <iframe v-if="loginModalVisible" :src="oauthUri" width="100%" height="600" frameborder="0"></iframe>
  </el-dialog>
</template>

<script>
  import URI from 'urijs'
  import { mapState } from 'vuex'

  import rc from '../api/ringcentral'
  import config from '../config'

  export default {
    computed: {
      oauthUri: function (prompt = true) {
        return rc.oauthUri(prompt)
      },
      ...mapState(['token', 'loginModalVisible'])
    },
    created: function () {
      window.addEventListener('message', ({ origin, data: { type, redirectUri } }) => {
        if (origin !== window.location.origin || type !== 'REDIRECT_URI') {
          return
        }
        if (redirectUri.indexOf(config.OAUTH_REDIRECT_URI) === -1) {
          return // unexpected uri
        }
        const token = URI(redirectUri.replace('#', '?')).search(true)
        if (token.access_token === undefined) { // unexpected data
          throw new Error(JSON.stringify(token, null, 2))
        }
        this.$store.commit('setToken', token)
        this.$store.commit('hideLoginModal')
      })
    }
  }
</script>
