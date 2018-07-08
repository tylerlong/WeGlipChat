<template>
  <div>
    <div class="text-align-center">
      <h1>WeGlipChat</h1>
      <p>A Glip client inspired by WeChat. <i class="f7-icons">social_github_fill</i> <a href="https://github.com/tylerlong/WeGlipChat" class="external" target="_blank">tylerlong/WeGlipChat</a></p>
      <p><f7-button color="green" fill @click="logIn">Log In</f7-button></p>
    </div>
    <f7-popup :opened="showModal">
      <f7-page>
        <f7-navbar title="Log In">
        </f7-navbar>
        <f7-block>
          <iframe v-if="showModal" :src="oauthUri" width="100%" height="600" frameborder="0"></iframe>
        </f7-block>
      </f7-page>
    </f7-popup>
  </div>
</template>

<script>
import { f7Button, f7Popup, f7Page, f7Navbar, f7Block } from 'framework7-vue'
import URI from 'urijs'

import rc from '../api/ringcentral'
import config from '../config'

export default {
  components: {
    f7Button, f7Popup, f7Page, f7Navbar, f7Block
  },
  data: function () {
    return { showModal: false }
  },
  computed: {
    oauthUri: function () {
      return rc.authorizeUri(config.OAUTH_REDIRECT_URI)
    }
  },
  methods: {
    logIn: function () {
      this.showModal = true
    }
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
      this.showModal = false
    })
  }
}
</script>
