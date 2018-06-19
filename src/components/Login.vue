<template>
  <div>
    <f7-button fill @click="logIn">Log In</f7-button>
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
