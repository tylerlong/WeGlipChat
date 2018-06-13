<template>
  <div>
    <div v-if="authorized">You are logged in. <button @click="logOut">Log Out</button></div>
    <button v-else @click="logIn">Log In</button>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters(['authorized'])
    },
    watch: {
      authorized: function (newVal, oldVal) {
        if (newVal) {
          this.$router.push('/')
        }
      }
    },
    methods: {
      logIn: function () {
        this.$store.commit('showLoginModal')
      },
      logOut: function () {
        this.$store.commit('setToken', null)
      }
    }
  }
</script>
