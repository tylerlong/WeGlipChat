```
WeGlipChat git:(master) ✗ yarn server
yarn run v1.6.0
$ parcel index.html
Server running at http://localhost:1234
🚨  /Users/tyler.liu/src/vue/WeGlipChat/App.vue: Cannot read property 'parseComponent' of undefined
    at Object.parse (/Users/tyler.liu/src/vue/WeGlipChat/node_modules/@vue/component-compiler-utils/dist/parse.js:14:23)
    at VueAsset.parse (/Users/tyler.liu/src/vue/WeGlipChat/node_modules/parcel-bundler/src/assets/VueAsset.js:20:21)
    at <anonymous>
```

Workaround:

```
yarn add --dev @vue/component-compiler-utils@1.3.1
```



`window.app.authorized = true` has no effect, strange.
But Vue extension for Chrome does work like a charm!
