import RingCentral from 'ringcentral-js-concise'
import Cookies from 'js-cookie'

import config from '../config'

const rc = new RingCentral(config.RINGCENTRAL_CLIENT_ID, '', config.RINGCENTRAL_SERVER_URI)

export default {
  oauthUri (prompt = true) {
    return rc.authorizeUri(config.OAUTH_REDIRECT_URI, { responseType: 'token', prompt: prompt ? '' : 'none' })
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
