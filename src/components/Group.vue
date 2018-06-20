<template>
  <f7-page>
    <f7-navbar title="Chat" back-link="Back" @back-click="goToRoot">
    </f7-navbar>
    <span v-if="group">{{ group.id }} - {{ group.type }}</span>
    <p v-for="post in posts">{{ post.type }} - {{ post.text }}</p>
  </f7-page>
</template>

<script>
import { f7Navbar, f7Page, f7Block, f7List, f7ListItem, f7NavRight, f7Link } from 'framework7-vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    f7Navbar, f7Page, f7Block, f7List, f7ListItem, f7NavRight, f7Link
  },
  computed: {
    ...mapGetters(['getGroupById', 'getPostByGroupId']),
    group: function () {
      return this.getGroupById(this.$route.params.id)
    },
    posts: function () {
      return this.getPostByGroupId(this.$route.params.id)
    }
  },
  mounted: function () {
    this.$store.dispatch('fetchPosts', this.$route.params.id)
  },
  methods: {
    goToRoot () {
      this.$router.push({ name: 'root' })
    }
  }
}
</script>
