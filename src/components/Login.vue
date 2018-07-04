<template>
  <div class="text-align-center">
    <h1>WeGlipChat</h1>
    <p>A Glip client inspired by WeChat. <i class="f7-icons">social_github_fill</i> <a href="https://github.com/tylerlong/WeGlipChat" class="external" target="_blank">tylerlong/WeGlipChat</a></p>
    <p><f7-button color="green" fill @click="logIn">Log In</f7-button></p>
  </div>
</template>

<script>
import { f7Button } from 'framework7-vue'

export default {
  components: {
    f7Button
  },
  methods: {
    logIn: function () {
      this.$store.commit('showLoginModal')
    }
  }
}
</script>
