<template>
  <el-dialog title="Log In" :visible="loginModalVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <iframe v-if="loginModalVisible" ref="oauthIframe" :src="oauthUri" width="100%" height="600" frameborder="0" @load="iframeLoad"></iframe>
  </el-dialog>
</template>

<script>
  import URI from 'urijs'
  import { mapState } from 'vuex'
  import Cookies from 'js-cookie'
  import * as R from 'ramda'

  import rc from '../api/ringcentral'
  import config from '../config'

  export default {
    computed: {
      oauthUri: function (prompt = true) {
        return rc.oauthUri(prompt)
      },
      ...mapState(['token', 'loginModalVisible'])
    },
    watch: {
      token: function (newToken, oldToken) {
        if (!R.isNil(newToken) && !R.isNil(newToken.access_token)) {
          Cookies.set('RINGCENTRAL_TOKEN', JSON.stringify(newToken), { expires: 1 / 24 })
        } else {
          Cookies.remove('RINGCENTRAL_TOKEN')
        }
      }
    },
    methods: {
      iframeLoad: function () {
        let redirectUri = null
        try {
          redirectUri = this.$refs.oauthIframe.contentWindow.location.href
        } catch (error) {
          if (error.message.indexOf('cross-origin') !== -1) {
            return
          }
          throw error
        }
        if (redirectUri.indexOf(config.OAUTH_REDIRECT_URI) === -1) {
          return // not expected uri
        }
        const token = URI(redirectUri.replace('#', '?')).search(true)
        if (token.access_token === undefined) {
          throw new Error(JSON.stringify(token, null, 2))
        }
        this.$store.commit('setToken', token)
        this.$store.commit('hideLoginModal')
      }
    }
  }
</script>
