<template>
  <div>
    <p>Welcome<span v-if="extension"> {{ extension.name }}</span>!</p>
    <p><button v-if="token" @click="logOut">Log Out</button></p>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['token', 'extension'])
  },
  methods: {
    logOut: function () {
      this.$store.commit('setToken', undefined)
    }
  }
}
</script>
