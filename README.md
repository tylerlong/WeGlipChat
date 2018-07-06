# WeGlipChat

A Glip client inspired by WeChat.

### [Start using WebGlipChat](https://tylerlong.github.io/wgc/)


## Motivations

[RingCentral Glip](https://glip.com/) is a great team collaboration tool.
RingCentral offers [Glip Restful API in beta](https://developer.ringcentral.com/api-docs/latest/index.html#!#GlipApi.html).

[WeChat](https://en.wikipedia.org/wiki/WeChat) is one of most popular messaging tool in China.
It's especially famous for its ease of use.

I'd like to take advantages of RingCentral Glip API to build a Glip client which is as user friendly as WeChat.

I also want to try something new, such [Vue.js](https://vuejs.org/).
Personally I like things simple and working.
I want to see how simple a project I can manage to produce.


## Technical stack

- [Vue.js](https://vuejs.org/)
- [Webpack](https://webpack.js.org/)
- [Vuex](https://vuex.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Framework7](http://framework7.io/)
- [localForage](https://github.com/localForage/localForage)
- [Ramda](https://ramdajs.com/)
- [RingCentral JS Concise](https://github.com/tylerlong/ringcentral-js-concise)


## Release

```
cp src/config.sample.js  src/config.js
edit src/config.js
yarn install
yarn release
```

Update RingCentral app and change redirect uri to `<your-server>/oauth.html`.
