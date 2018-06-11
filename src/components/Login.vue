<template>
  <div>
    <button @click="logIn">Log In</button>
  </div>
</template>

<script>
  import rc from '../api/ringcentral'

  export default {
    methods: {
      logIn: function () {
        rc.logIn(token => {
          console.log(token)
        })
      }
    }
  }
</script>
