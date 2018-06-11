<template>
  <div>
    <p>You are <span v-if="authorized">authorized</span><span v-else>unauthorized</span>.</p>
    <button v-on:click="authorize">Authorize</button>
  </div>
</template>

<script>
import RingCentral from 'ringcentral-js-concise'

import config from './config'

const rc = new RingCentral(config.RINGCENTRAL_CLIENT_ID, '', config.RINGCENTRAL_SERVER_URI)

export default {
  data: function () {
    return {
      authorized: false
    }
  },
  methods: {
    authorize: function () {
      const vm = this
      const authUri = rc.authorizeUri(config.OAUTH_REDIRECT_URI, { responseType: 'token' })
      console.log(authUri)
      var oauthWindow = window.open(authUri, 'oauthWindow', 'width=800, height=600')
      var oauthInterval = window.setInterval(function () {
        try {
          if (oauthWindow.document.URL.indexOf(config.OAUTH_REDIRECT_URI) !== -1) {
            window.clearInterval(oauthInterval)
            oauthWindow.close()
            vm.authorized = true
            console.log('authorized')
          }
        } catch (e) {
          // cross origin access
          console.log('not yet authorized')
        }
      }, 1000)
    }
  }
}
</script>
