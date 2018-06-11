import RingCentral from 'ringcentral-js-concise'
import URI from 'urijs'

import config from '../config'

const rc = new RingCentral(config.RINGCENTRAL_CLIENT_ID, '', config.RINGCENTRAL_SERVER_URI)

export default {
  logIn (cb) {
    const oauthUri = rc.authorizeUri(config.OAUTH_REDIRECT_URI, { responseType: 'token' })
    var oauthWindow = window.open(oauthUri, 'oauthWindow', 'width=800, height=600')
    var oauthInterval = window.setInterval(function () {
      try {
        const uri = oauthWindow.document.URL
        if (uri.indexOf(config.OAUTH_REDIRECT_URI) !== -1) {
          window.clearInterval(oauthInterval)
          oauthWindow.close()
          const token = URI(uri.replace('#', '?')).search(true)
          cb(token)
        }
      } catch (e) {
        if (e.message.indexOf('cross-origin') === -1) {
          throw e
        }
        // cross-origin access, ignore
      }
    }, 1000)
  }
}
