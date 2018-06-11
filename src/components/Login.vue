<template>
  <div>
    <button @click="logIn">Log In</button>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'

  import rc from '../api/ringcentral'

  export default {
    methods: {
      logIn: function () {
        rc.logIn(token => {
          Cookies.set('RINGCENTRAL_ACCESS_TOKEN', token.access_token, { expires: 1 / 24 })
          this.$router.push('/')
        })
      }
    }
  }
</script>
