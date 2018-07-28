<template>
  <f7-page :page-content="false">
    <tabs active="glip"></tabs>
    <div class="page-content">
      <f7-list media-list v-if="groups">
        <f7-list-item
          link="#"
          :title="getGroupNameById(group.id)"
          :text="getGroupMessagePreviewText(group)"
          v-for="group in groups"
          :key="group.id"
          @click="openGroup(group.id)"
          :badge="getUnreadCounts(group.id)"
          badge-color="red"
        >
        <img slot="media" :src="getGroupAvatar(group)" class="avatar-image" />
        </f7-list-item>
      </f7-list>
      <f7-block v-else class="text-align-center">
        <preloader></preloader>
      </f7-block>
    </div>
  </f7-page>
</template>

<script>
import { f7Page, f7Tabs, f7Tab, f7Link, f7Toolbar, f7List, f7ListItem, f7Block } from 'framework7-vue'
import { mapState, mapGetters } from 'vuex'

import Settings from './Settings.vue'
import Tabs from './Tabs.vue'
import Preloader from './Preloader.vue'

export default {
  components: {
    Settings, Tabs, Preloader, f7Page, f7Tabs, f7Tab, f7Link, f7Toolbar, f7List, f7ListItem, f7Block
  },
  computed: {
    ...mapState(['groups']),
    ...mapGetters(['getGroupNameById', 'getGroupAvatar', 'getGroupMessagePreviewText', 'getUnreadCounts'])
  },
  methods: {
    openGroup (id) {
      this.$router.push({ name: 'group', params: { id } })
    }
  }
}
</script>
