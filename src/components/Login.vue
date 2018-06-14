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
        if (newVal) {
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
