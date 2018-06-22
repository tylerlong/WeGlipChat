<template>
  <f7-page v-if="group">
    <f7-navbar :title="group.name || group.members.join(', ')" back-link="Back" @back-click="goToRoot">
    </f7-navbar>
    <f7-messages>
      <f7-message
        v-for="post in posts"
        type="received"
        :image="postImage(post)"
        :key="post.id">
        <span slot="text" v-if="post.text" v-html="post.text"></span>
      </f7-message>
    </f7-messages>
  </f7-page>
</template>

<script>
import { f7Navbar, f7Page, f7Block, f7List, f7ListItem, f7NavRight, f7Link, f7Messages, f7Message } from 'framework7-vue'
import { mapGetters } from 'vuex'
import { isNil, test } from 'ramda'

export default {
  components: {
    f7Navbar, f7Page, f7Block, f7List, f7ListItem, f7NavRight, f7Link, f7Messages, f7Message
  },
  computed: {
    ...mapGetters(['getGroupById', 'getPostsByGroupId']),
    group: function () {
      return this.getGroupById(this.$route.params.id)
    },
    posts: function () {
      const posts = this.getPostsByGroupId(this.$route.params.id)
      if (posts) {
        posts.reverse()
      }
      return posts
    }
  },
  mounted: function () {
    this.$store.dispatch('fetchPosts', this.$route.params.id)
  },
  methods: {
    goToRoot () {
      this.$router.push({ name: 'root' })
    },
    postImage: function (post) {
      if (isNil(post.attachments)) {
        return undefined
      }
      const file = post.attachments[0]
      if (!test(/\.(?:png|jpg|gif|bmp|tiff|jpeg)$/i, file.name)) {
        return undefined
      }
      return post.attachments[0].contentUri
    },
    postText: function (post) {
      let text = post.text
      if (isNil(text)) {
        text = ''
      }
      if (!isNil(post.attachments)) {

      }
      return text
    }
  }
}
</script>
