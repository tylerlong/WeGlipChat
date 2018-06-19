<template>
  <f7-page :page-content="false">
    <f7-toolbar tabbar>
      <f7-link tab-link="#glip" tab-link-active>Glip</f7-link>
      <f7-link tab-link="#settings">Settings</f7-link>
    </f7-toolbar>
    <f7-tabs animated>
      <f7-tab id="glip" class="page-content" tab-active>
        <glip></glip>
      </f7-tab>
      <f7-tab id="settings" class="page-content">
        <settings></settings>
      </f7-tab>
    </f7-tabs>
  </f7-page>
</template>

<script>
import { f7Page, f7Tabs, f7Tab, f7Link, f7Toolbar } from 'framework7-vue'

import Glip from './Glip.vue'
import Settings from './Settings.vue'

export default {
  components: {
    f7Page, f7Tabs, f7Tab, f7Link, f7Toolbar, Glip, Settings
  }
}
</script>
