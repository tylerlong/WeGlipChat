<template>
  <div class="page">
    <div class="navbar">
      <div class="navbar-inner">
        <div class="left">
          <a @click="goBack" class="link">
            <i class="icon icon-back"></i>
          </a>
        </div>
        <div class="title">{{ name }}</div>
        <div class="right"></div>
      </div>
    </div>
    <div class="page-content text-align-center">
      <p><img :src="avatar" width="256px"/></p>
      <p><strong>{{ name }}</strong></p>
      <p v-if="person">{{ person.email }}</p>
      <p><button class="button color-green button-fill" @click="startChatWithPerson">Start Chat</button></p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Tabs from './Tabs.vue'

export default {
  components: {
    Tabs
  },
  computed: {
    ...mapGetters(['getPersonNameById', 'getPersonAvatar', 'getPerson', 'isMyself', 'getPersonalGroup']),
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
    async startChatWithPerson () {
      const personId = this.$route.params.id
      if (this.isMyself(personId)) {
        const group = this.getPersonalGroup()
        this.$router.push({ name: 'group', params: { id: group.id } })
      } else {
        const group = await this.$store.dispatch('ensurePrivateGroup', personId)
        this.$router.push({ name: 'group', params: { id: group.id } })
      }
    }
  }
}
</script>
