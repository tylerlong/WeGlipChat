<template>
  <f7-page :page-content="false">
    <f7-navbar :title="name" back-link="Back" @back-click="goBack">
    </f7-navbar>
    <div class="page-content text-align-center">
      <p><img :src="avatar" width="256px"/></p>
      <p><strong>{{ name }}</strong></p>
      <p v-if="person">{{ person.email }}</p>

    </div>
  </f7-page>
</template>

<script>
import { f7Page, f7Navbar } from 'framework7-vue'
import { mapGetters } from 'vuex'

import Tabs from './Tabs.vue'

export default {
  components: {
    f7Page, f7Navbar, Tabs
  },
  computed: {
    ...mapGetters(['getPersonNameById', 'getPersonAvatar', 'getPerson']),
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
    }
  }
}
</script>
