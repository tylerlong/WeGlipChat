<template>
  <f7-page v-if="group">
    <f7-navbar :title="group.name || group.members.join(', ')" back-link="Back" @back-click="goToRoot">
    </f7-navbar>
    <f7-messages>
      <f7-message v-for="post in posts" type="received" :key="post.id">
        <div slot="text">
          <div v-if="post.text" v-html="postText(post)"></div>
          <div v-if="post.attachments">
            <template v-for="file in post.attachments">
              <img v-if="isImage(file)" :src="file.contentUri" style="width: 100%; height: auto;"/>
              <a v-else :href="file.contentUri">{{ file.name }}</a>
            </template>
          </div>
        </div>
      </f7-message>
    </f7-messages>
  </f7-page>
</template>

<script>
import { f7Navbar, f7Page, f7Block, f7List, f7ListItem, f7NavRight, f7Link, f7Messages, f7Message } from 'framework7-vue'
import { mapGetters } from 'vuex'
import { isNil, test } from 'ramda'
import { Markdown } from 'glipdown'

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
    postText (post) {
      return Markdown(post.text).replace(/\n/g, '<br/>')
    },
    isImage (file) {
      return test(/\.(?:png|jpg|gif|bmp|tiff|jpeg)$/i, file.name)
    },
    postAttachments: function (post) {
      let attachments = []
      if (!isNil(post.attachments)) {
        for (const file of post.attachments) {
          if (test(/\.(?:png|jpg|gif|bmp|tiff|jpeg)$/i, file.name)) {
            attachments.push(`<img src="${file.contentUri}" style="width: 100%; height: auto;"/>`)
          } else {
            attachments.push(`<a download href="${file.contentUri}">${file.name}</a>`)
          }
        }
      }
      return attachments.join('')
    }
  }
}
</script>
