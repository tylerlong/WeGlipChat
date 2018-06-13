<template>
  <el-dialog title="Log In" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <iframe ref="oauthIframe" :src="oauthUri" width="100%" height="600" frameborder="0" @load="iframeLoad"></iframe>
  </el-dialog>
</template>

<script>
  import URI from 'urijs'

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
        const token = URI(redirectUri.replace('#', '?')).search(true)
        console.log(JSON.stringify(token, null, 2))
      }
    }
  }
</script>
