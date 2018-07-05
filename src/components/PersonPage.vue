<template>
  <f7-page :page-content="false">
    <f7-navbar :title="name" back-link="Back" @back-click="goBack">
    </f7-navbar>
    <div class="page-content text-align-center">
      <p><img :src="avatar" width="256px"/></p>
      <p><strong>{{ name }}</strong></p>
      <p v-if="person">{{ person.email }}</p>
      <p><f7-button color="green" fill @click="startChatWithPerson">Start Chat</f7-button></p>
    </div>
  </f7-page>
</template>

<script>
import { f7Page, f7Navbar, f7Button } from 'framework7-vue'
import { mapGetters } from 'vuex'

import Tabs from './Tabs.vue'

export default {
  components: {
    f7Page, f7Navbar, f7Button, Tabs
  },
  computed: {
    ...mapGetters(['getPersonNameById', 'getPersonAvatar', 'getPerson', 'isMyself', 'getPersonalGroup', 'getPrivateGroup']),
    person: function () {
      return this.getPerson(this.$route.params.id)
    },
    name: function () {
      return this.getPersonNameById(this.$route.params.id)
    },
    avatar: function () {
      return this.getPersonAvatar(this.$route.params.id)
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    startChatWithPerson () {
      const personId = this.$route.params.id
      if (this.isMyself(personId)) {
        const group = this.getPersonalGroup()
        this.$router.push({ name: 'group', params: { id: group.id } })
      } else {
        const group = this.getPrivateGroup(personId)
        this.$router.push({ name: 'group', params: { id: group.id } })
        // todo: what if group is undefined?
      }
    }
  }
}
</script>
