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
        <img slot="media" :src="groupImage(group)" width="42" height="42" />
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
import * as R from 'ramda'

import Settings from './Settings.vue'
import Tabs from './Tabs.vue'

export default {
  components: {
    Settings, Tabs, f7Page, f7Tabs, f7Tab, f7Link, f7Toolbar, f7List, f7ListItem, f7Preloader, f7Block
  },
  computed: {
    ...mapState(['groups', 'extension', 'persons']),
    ...mapGetters(['getGroupNameById', 'isMyself'])
  },
  methods: {
    openGroup (id) {
      this.$router.push({ name: 'group', params: { id } })
    },
    groupImage (group) {
      if (group.type === 'PrivateChat') {
        const memberId = group.members.filter(id => !this.isMyself(id))[0]
        if (this.persons[memberId]) {
          const avatar = this.persons[memberId].avatar
          if (R.isNil(avatar)) {
            return 'https://via.placeholder.com/64x64'
          }
          return avatar
        }
      }
      return 'https://via.placeholder.com/64x64'
    }
  }
}
</script>
