<template>
  <f7-toolbar tabbar>
    <f7-link @click="openTab('root')" tab-link :tab-link-active="active === 'glip'"><f7-icon if-ios="f7:chat" if-md="material:chat"></f7-icon></f7-link>
    <!-- <f7-link @click="openTab('contacts')" tab-link :tab-link-active="active === 'contacts'"><f7-icon if-ios="f7:persons" if-md="material:group"></f7-icon></f7-link> -->
    <f7-link @click="openTab('settings')" tab-link :tab-link-active="active === 'settings'"><f7-icon if-ios="f7:settings" if-md="material:settings"></f7-icon></f7-link>
  </f7-toolbar>
</template>

<script>
import { f7Toolbar, f7Link, f7Icon } from 'framework7-vue'

export default {
  components: {
    f7Toolbar, f7Link, f7Icon
  },
  props: ['active'],
  methods: {
    openTab: function (name) {
      this.$router.push({ name })
    }
  }
}
</script>
