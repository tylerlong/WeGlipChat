import RingCentral from 'ringcentral-js-concise'

import config from '../config'

const rc = new RingCentral(config.RINGCENTRAL_CLIENT_ID, '', config.RINGCENTRAL_SERVER_URI)

rc.oauthUri = function (prompt = true) {
  return rc.authorizeUri(config.OAUTH_REDIRECT_URI, { responseType: 'token', prompt: prompt ? '' : 'none' })
}

export default rc
