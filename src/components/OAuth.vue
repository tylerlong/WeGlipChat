<template>
  <el-dialog title="Log In" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <iframe v-if="!authorized" ref="oauthIframe" :src="oauthUri" width="100%" height="600" frameborder="0" @load="iframeLoad"></iframe>
    <pre v-else>{{ accessToken }}</pre>
  </el-dialog>
</template>

<script>
  import URI from 'urijs'
  import { mapGetters } from 'vuex'

  import rc from '../api/ringcentral'

  export default {
    data: function () {
      return {
        visible: true
      }
    },
    computed: {
      oauthUri: function () {
        return rc.oauthUri()
      },
      ...mapGetters(['authorized', 'accessToken'])
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
        const token = URI(redirectUri.replace('#', '?')).search(true)
        this.$store.commit('setToken', token)
      }
    }
  }
</script>
