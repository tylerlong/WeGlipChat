<template>
  <f7-page :page-content="false">
    <tabs active="contacts"></tabs>
    <div class="page-content">
      <p>Hello contacts</p>
    </div>
  </f7-page>
</template>

<script>
import { f7Page } from 'framework7-vue'

import Tabs from './Tabs.vue'

export default {
  components: {
    f7Page, Tabs
  }
}
</script>
