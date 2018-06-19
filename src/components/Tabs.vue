<template>
  <f7-toolbar tabbar>
    <f7-link @click="openTab('root')" tab-link :tab-link-active="active === 'glip'">Glip</f7-link>
    <f7-link @click="openTab('contacts')" tab-link :tab-link-active="active === 'contacts'">Contacts</f7-link>
    <f7-link @click="openTab('settings')" tab-link :tab-link-active="active === 'settings'">Settings</f7-link>
  </f7-toolbar>
</template>

<script>
import { f7Toolbar, f7Link } from 'framework7-vue'

export default {
  components: {
    f7Toolbar, f7Link
  },
  props: ['active'],
  methods: {
    openTab: function (name) {
      this.$router.push({ name })
    }
  }
}
</script>
