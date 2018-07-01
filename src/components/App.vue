<template>
  <f7-page :page-content="false">
    <tabs active="glip"></tabs>
    <div class="page-content">
      <f7-list media-list v-if="groups">
        <f7-list-item
          link="#"
          :title="getGroupNameById(group.id)"
          text="..."
          v-for="group in groups"
          :key="group.id"
          @click="openGroup(group.id)"
        >
        <img slot="media" :src="getGroupAvatar(group)" width="42" height="42" />
        </f7-list-item>
      </f7-list>
      <f7-block v-else class="text-align-center">
        <f7-preloader color="orange"></f7-preloader>
      </f7-block>
    </div>
  </f7-page>
</template>

<script>
import { f7Page, f7Tabs, f7Tab, f7Link, f7Toolbar, f7List, f7ListItem, f7Preloader, f7Block } from 'framework7-vue'
import { mapState, mapGetters } from 'vuex'

import Settings from './Settings.vue'
import Tabs from './Tabs.vue'

export default {
  components: {
    Settings, Tabs, f7Page, f7Tabs, f7Tab, f7Link, f7Toolbar, f7List, f7ListItem, f7Preloader, f7Block
  },
  computed: {
    ...mapState(['groups', 'extension', 'persons']),
    ...mapGetters(['getGroupNameById', 'isMyself', 'getGroupAvatar'])
  },
  methods: {
    openGroup (id) {
      this.$router.push({ name: 'group', params: { id } })
    }
  }
}
</script>
