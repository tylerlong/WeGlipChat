<template>
  <div>
    <button @click="logIn">Log In</button>
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
        this.$router.push('/')
        console.log('watch')
      }
    },
    methods: {
      logIn: async function () {
        this.$store.commit('showLoginModal')
        // Cookies.set('RINGCENTRAL_ACCESS_TOKEN', token.access_token, { expires: 1 / 24 })
        // this.$router.push('/')
      }
    }
  }
</script>
