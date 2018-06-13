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
      const token = Cookies.get('RINGCENTRAL_TOKEN')
      if (token === undefined) {
        return false
      }
      rc.token(JSON.parse(token))
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
