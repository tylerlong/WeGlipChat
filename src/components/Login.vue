<template>
  <div>
    <button @click="logIn">Log In</button>
  </div>
</template>

<script>
  export default {
    methods: {
      logIn: function () {
        this.$store.commit('showLoginModal')
      }
    }
  }
</script>
