<template>
  <f7-page v-if="group">
    <f7-navbar :title="group.name || group.members.join(', ')" back-link="Back" @back-click="goToRoot">
    </f7-navbar>
    <f7-messages>
      <f7-message v-for="post in posts()" :type="isMyself(post.creatorId) ? 'sent' : 'received'" :key="post.id">
        <div slot="text">
          <div v-if="post.text" v-html="postText(post)"></div>
          <div v-if="post.attachments">
            <template v-for="file in post.attachments">
              <img v-if="isImage(file)" :src="file.contentUri" class="attachment-image"/>
              <a v-else :href="file.contentUri" class="external" target="_blank">{{ file.name }}</a>
            </template>
          </div>
          <div v-if="post.text === null && post.attachments === null">Unsupported message</div>
        </div>
      </f7-message>
    </f7-messages>
  </f7-page>
</template>

<script>
import { f7Navbar, f7Page, f7Block, f7List, f7ListItem, f7NavRight, f7Link, f7Messages, f7Message } from 'framework7-vue'
import { mapGetters } from 'vuex'
import { test, reverse } from 'ramda'
import { Markdown } from 'glipdown'

export default {
  components: {
    f7Navbar, f7Page, f7Block, f7List, f7ListItem, f7NavRight, f7Link, f7Messages, f7Message
  },
  computed: {
    ...mapGetters(['getGroupById', 'getPostsByGroupId', 'isMyself']),
    group: function () {
      return this.getGroupById(this.$route.params.id)
    }
  },
  methods: {
    posts () {
      const posts = this.getPostsByGroupId(this.$route.params.id)
      if (posts) {
        return reverse(posts)
      } else {
        this.$store.dispatch('fetchPosts', this.$route.params.id)
      }
    },
    goToRoot () {
      this.$router.push({ name: 'root' })
    },
    postText (post) {
      return Markdown(post.text).replace(/\n/g, '<br/>')
    },
    isImage (file) {
      return test(/\.(?:png|jpg|gif|bmp|tiff|jpeg)$/i, file.name)
    }
  }
}
</script>
