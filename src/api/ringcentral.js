import RingCentral from 'ringcentral-js-concise'
import URI from 'urijs'
import Cookies from 'js-cookie'

import config from '../config'

const rc = new RingCentral(config.RINGCENTRAL_CLIENT_ID, '', config.RINGCENTRAL_SERVER_URI)

export default {
  oauthUri () {
    return rc.authorizeUri(config.OAUTH_REDIRECT_URI, { responseType: 'token' })
  },
  logIn () {
    return new Promise((resolve, reject) => {
      const oauthUri = rc.authorizeUri(config.OAUTH_REDIRECT_URI, { responseType: 'token' })
      var oauthWindow = window.open(oauthUri, 'oauthWindow', 'width=800,height=600,top=100')
      var oauthInterval = window.setInterval(function () {
        if (oauthWindow.closed) {
          window.clearInterval(oauthInterval)
          return
        }
        console.log('interval')
        try {
          const uri = oauthWindow.document.URL
          if (uri.indexOf(config.OAUTH_REDIRECT_URI) !== -1) {
            window.clearInterval(oauthInterval)
            oauthWindow.close()
            const token = URI(uri.replace('#', '?')).search(true)
            resolve(token)
          }
        } catch (e) {
          if (e.message.indexOf('cross-origin') === -1) {
            reject(e)
          }
        // cross-origin access, ignore
        }
      }, 1000)
    })
  },

  async authorized () {
    if (rc.token() === undefined) {
      const accessToken = Cookies.get('RINGCENTRAL_ACCESS_TOKEN')
      if (accessToken === undefined) {
        return false
      }
      rc.token({ access_token: accessToken })
    }
    try {
      await rc.get('/restapi/v1.0/account/~/extension/~')
      return true
    } catch (e) {
      console.log(e.response.data)
      return false
    }
  }
}
