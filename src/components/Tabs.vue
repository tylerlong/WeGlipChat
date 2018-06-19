<template>
  <f7-toolbar tabbar>
    <f7-link @click="$router.push('/')" :tab-link-active="active === 'glip'">Glip</f7-link>
    <f7-link @click="$router.push('/settings/')" :tab-link-active="active === 'settings'">Settings</f7-link>
  </f7-toolbar>
</template>

<script>
import { f7Toolbar, f7Link } from 'framework7-vue'

export default {
  components: {
    f7Toolbar, f7Link
  },
  props: ['active']
}
</script>
