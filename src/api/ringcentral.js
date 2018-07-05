import RingCentral from 'ringcentral-js-concise'

import config from '../config'

const rc = new RingCentral(config.RINGCENTRAL_CLIENT_ID, config.RINGCENTRAL_CLIENT_SECRET, config.RINGCENTRAL_SERVER_URI)

rc.oauthUri = function () {
  return rc.authorizeUri(config.OAUTH_REDIRECT_URI)
}

export default rc
