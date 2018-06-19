<template>
  <div>
    <p>Welcome<span v-if="extension"> {{ extension.name }}</span>!</p>
    <f7-button fill v-if="token" @click="logOut">Log Out</f7-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { f7Button } from 'framework7-vue'

export default {
  components: {
    f7Button
  },
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
