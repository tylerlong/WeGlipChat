<template>
  <div>
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
