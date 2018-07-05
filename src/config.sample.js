let config = null

switch (process.env.NODE_ENV) {
  case 'production':
    config = {
      RINGCENTRAL_SERVER_URI: 'https://platform.ringcentral.com',
      RINGCENTRAL_CLIENT_ID: 'ringcentral-app-client-id',
      RINGCENTRAL_CLIENT_SECRET: 'ringcentral-app-client-secret',
      OAUTH_REDIRECT_URI: 'https://your-website.com/oauth.html'
    }
    break
  default:
    config = {
      RINGCENTRAL_SERVER_URI: 'https://platform.devtest.ringcentral.com',
      RINGCENTRAL_CLIENT_ID: 'ringcentral-app-client-id',
      RINGCENTRAL_CLIENT_SECRET: 'ringcentral-app-client-secret',
      OAUTH_REDIRECT_URI: 'http://localhost:1234/oauth.html'
    }
    break
}

export default config
