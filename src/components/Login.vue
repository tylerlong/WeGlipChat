<template>
  <div>
    <div class="text-align-center">
      <h1>WeGlipChat</h1>
      <p>A Glip client inspired by WeChat. <i class="f7-icons">social_github_fill</i> <a href="https://github.com/tylerlong/WeGlipChat" class="external" target="_blank">tylerlong/WeGlipChat</a></p>
      <h3><i class="f7-icons">cloud_download</i> <a href="https://github.com/tylerlong/wgc-desktop/releases" target="_blank" class="external">Download apps for macOS, Windows & Linux</a> <i class="f7-icons">cloud_download</i></h3>
      <p><button class="button color-green button-fill" @click="openModal">Log In</button></p>
    </div>
    <div class="popup" id="login-popup">
      <div class="page">
        <div class="page-content">
          <div class="navbar">
            <div class="navbar-inner">
              <div class="left"></div>
              <div class="title">Log In</div>
              <div class="right"></div>
            </div>
          </div>
          <div class="block">
            <iframe v-if="showModal" :src="oauthUri" width="100%" height="600" frameborder="0"></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import URI from 'urijs'

import rc from '../api/ringcentral'
import config from '../config'
import framework7 from '../framework7'

export default {
  data: function () {
    return { showModal: false }
  },
  computed: {
    oauthUri: function () {
      return rc.authorizeUri(config.OAUTH_REDIRECT_URI)
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
      this.closeModal()
    })
  },
  methods: {
    openModal: function () {
      this.showModal = true
      framework7.popup.open('#login-popup', true)
    },
    closeModal: function () {
      this.showModal = false
      framework7.popup.close('#login-popup', true)
    }
  }
}
</script>
