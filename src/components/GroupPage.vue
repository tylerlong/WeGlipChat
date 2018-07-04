<template>
  <f7-page v-if="group">
    <f7-navbar :title="groupName" back-link="Back" @back-click="goToRoot">
    </f7-navbar>
    <f7-messagebar placeholder="Message" ref="messagebar">
      <f7-link
        icon-if-ios="f7:arrow_up_fill"
        icon-if-md="material:send"
        slot="inner-end"
        @click="sendMessage"
      ></f7-link>
    </f7-messagebar>
    <f7-messages>
      <div class="message message-with-avatar" :class="isMyself(post.creatorId) ? 'message-sent' : 'message-received'" v-for="post in posts()" :key="post.id">
        <div :style="'background-image:url(' + getPersonAvatar(post.creatorId) + ')'" class="message-avatar"></div>
        <div class="message-content">
          <div class="message-name">{{ getPersonNameById(post.creatorId) }}</div>
          <div class="message-bubble">
            <div class="message-text" v-if="post.text" v-html="postText(post)"></div>
            <div v-if="post.attachments">
              <template v-for="file in post.attachments">
                <img v-if="isImage(file)" :src="file.contentUri" class="attachment-image"/>
                <a v-else :href="file.contentUri" class="external" target="_blank">{{ file.name }}</a>
              </template>
            </div>
            <div v-if="(post.text === null || post.text === '') && (post.attachments === null || post.attachments.length === 0)">Unsupported message</div>
          </div>
        </div>
      </div>
      <f7-block v-if="!posts()" class="text-align-center">
        <f7-preloader color="orange"></f7-preloader>
      </f7-block>
    </f7-messages>
  </f7-page>
  <f7-block v-else class="text-align-center">
    <f7-preloader color="orange"></f7-preloader>
  </f7-block>
</template>

<script>
import { f7Navbar, f7Page, f7Block, f7List, f7ListItem, f7NavRight, f7Link, f7Messages, f7Message, f7Preloader, f7Messagebar } from 'framework7-vue'
import { mapGetters } from 'vuex'
import * as R from 'ramda'
import { Markdown } from 'glipdown'
import cheerio from 'cheerio'
import delay from 'timeout-as-promise'

import { enableEmojiAutoComplete, emojiToImage } from '../emoji'

export default {
  components: {
    f7Navbar, f7Page, f7Block, f7List, f7ListItem, f7NavRight, f7Link, f7Messages, f7Message, f7Preloader, f7Messagebar
  },
  computed: {
    ...mapGetters(['getPersonNameById', 'getGroupById', 'getGroupNameById', 'getPostsByGroupId', 'isMyself', 'getPersonAvatar']),
    group: function () {
      return this.getGroupById(this.$route.params.id)
    },
    groupName: function () {
      return this.getGroupNameById(this.$route.params.id)
    }
  },
  methods: {
    posts () {
      if (!this.fetched) {
        this.fetched = true // avoid duplicate fetching
        this.$store.dispatch('fetchPosts', this.$route.params.id)
      }
      const posts = this.getPostsByGroupId(this.$route.params.id)
      if (posts) {
        return R.reverse(posts)
      }
    },
    goToRoot () {
      this.$router.push({ name: 'root' })
    },
    postText (post) {
      const html = Markdown(post.text).replace(/\n/g, '<br/>')
      const $ = cheerio.load(html)
      $('a').addClass('external')
      return emojiToImage($('body').html())
    },
    isImage (file) {
      return R.test(/\.(?:png|jpg|gif|bmp|tiff|jpeg)$/i, file.name)
    },
    sendMessage () {
      if (this.textarea.val() === '') {
        return
      }
      this.$store.dispatch('sendMessage', { groupId: this.$route.params.id, text: this.textarea.val() })
      this.textarea.val('')
    }
  },
  async mounted () {
    while (R.isNil(this.group)) {
      await delay(1000)
    }
    this.$store.dispatch('fetchPersons', this.group.members)
    this.textarea = this.$refs.messagebar.f7Messagebar.$textareaEl
    this.textarea.focus()
    this.textarea.on('keypress', (e) => {
      if (e.keyCode === 13) {
        if (!e.shiftKey) {
          e.preventDefault()
          this.sendMessage()
        }
      }
    })
    enableEmojiAutoComplete(this.textarea[0])
  }
}
</script>
