<template>
  <f7-page :page-content="false">
    <tabs active="contacts"></tabs>
    <div class="page-content">
      <p :key="person.id" v-for="person in getPersons()">{{ person.name }}</p>
    </div>
  </f7-page>
</template>

<script>
import { f7Page } from 'framework7-vue'
import { mapGetters } from 'vuex'

import Tabs from './Tabs.vue'

export default {
  components: {
    f7Page, Tabs
  },
  computed: {
    ...mapGetters(['getPersons'])
  }
}
</script>
