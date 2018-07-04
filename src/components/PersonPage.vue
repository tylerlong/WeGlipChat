<template>
  <f7-page :page-content="false">
    <f7-navbar :title="name" back-link="Back" @back-click="goBack">
    </f7-navbar>
    <div class="page-content">
      <p>Hello {{ name }}</p>
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
    ...mapGetters(['getPersonNameById']),
    name: function () {
      return this.getPersonNameById(this.$route.params.id)
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>
