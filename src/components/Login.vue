<template>
  <div>
    <button @click="logIn">Log In</button>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState(['token'])
    },
    watch: {
      token: function (newToken, oldToken) {
        if (newToken) {
          this.$router.push('/')
        }
      }
    },
    methods: {
      logIn: function () {
        this.$store.commit('showLoginModal')
      }
    }
  }
</script>
