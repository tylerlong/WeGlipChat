<template>
  <f7-page :page-content="false">
    <tabs active="glip"></tabs>
    <div class="page-content">
      <f7-list media-list v-if="groups">
        <f7-list-item
          link="#"
          :title="groupName(group)"
          text="..."
          v-for="group in groups"
          :key="group.id"
          @click="openGroup(group.id)"
        >
        <img slot="media" :src="groupImage(group)" width="42" height="42" />
        </f7-list-item>
      </f7-list>
    </div>
  </f7-page>
</template>

<script>
import { f7Page, f7Tabs, f7Tab, f7Link, f7Toolbar, f7List, f7ListItem } from 'framework7-vue'
import { mapState } from 'vuex'
import * as R from 'ramda'

import Settings from './Settings.vue'
import Tabs from './Tabs.vue'

export default {
  components: {
    f7Page, f7Tabs, f7Tab, f7Link, f7Toolbar, f7List, f7ListItem, Settings, Tabs
  },
  computed: {
    ...mapState(['groups', 'extension', 'persons'])
  },
  methods: {
    openGroup (id) {
      this.$router.push({ name: 'group', params: { id } })
    },
    groupImage (group) {
      if (group.type === 'PrivateChat') {
        const memberId = group.members.filter(m => m !== this.extension.id.toString())[0]
        if (this.persons[memberId]) {
          const avatar = this.persons[memberId].avatar
          if (R.isNil(avatar)) {
            return 'https://via.placeholder.com/64x64'
          }
          return avatar
        }
      }
      return 'https://via.placeholder.com/64x64'
    },
    groupName (group) {
      if (group.type === 'PrivateChat') {
        const memberId = group.members.filter(m => m !== this.extension.id.toString())[0]
        const person = this.persons[memberId]
        if (person) {
          if (!R.isNil(person.firstName) || !R.isNil(person.lastName)) {
            return `${person.firstName} ${person.lastName}`
          } else {
            return person.email
          }
        }
      }
      return group.name
    }
  }
}
</script>
