<template>
  <f7-page v-if="group">
    <f7-navbar :title="groupName" back-link="Back" @back-click="goToRoot">
    </f7-navbar>
    <f7-messagebar placeholder="Message" ref="messagebar">
      <input id="file-input" style="display: none;" type="file" @change="shareFile"/>
      <f7-link
        icon-if-ios="f7:arrow_up_fill"
        icon-if-md="material:attachment"
        slot="inner-start"
        onclick="document.getElementById('file-input').click()"
        title="Share file"
      ></f7-link>
      <f7-link
        icon-if-ios="f7:share_fill"
        icon-if-md="material:send"
        slot="inner-end"
        @click="sendMessage"
        title="Send"
        id="send-button"
        v-if="!sending"
      ></f7-link>
      <f7-preloader color="orange" v-else size="24" class="sending-loader"></f7-preloader>
    </f7-messagebar>
    <f7-messages>
      <template v-for="posts in groupedPosts()">
        <f7-messages-title>{{ timestamp(posts[0].creationTime) }}</f7-messages-title>
        <div class="message message-with-avatar" :class="isMyself(post.creatorId) ? 'message-sent' : 'message-received'" v-for="post in posts" :key="post.id">
          <div :style="'background-image:url(' + getPersonAvatar(post.creatorId) + ')'" class="message-avatar" @click="openPerson(post.creatorId)"></div>
          <div class="message-content">
            <div class="message-name">{{ getPersonNameById(post.creatorId) }}</div>
            <div class="message-bubble">
              <template v-if="post.type === 'TextMessage'">
                <div class="message-text" v-if="post.text" v-html="getPostText(post)"></div>
                <div v-if="post.attachments">
                  <template v-for="file in post.attachments">
                    <img v-if="isImage(file)" :src="file.contentUri" class="attachment-image"/>
                    <a v-else :href="file.contentUri" class="external" target="_blank">{{ file.name }}</a>
                  </template>
                </div>
              </template>
              <template v-if="post.type === 'PersonsAdded'">
                <div class="message-text" v-if="post.addedPersonIds" v-html="getPostText(post)"></div>
              </template>
              <div v-if="!isSupportedPost(post)">Unsupported message</div>
            </div>
          </div>
        </div>
      </template>
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
import { f7Navbar, f7Page, f7Block, f7List, f7ListItem, f7NavRight, f7Link, f7Messages, f7Message, f7Preloader, f7Messagebar, f7MessagesTitle } from 'framework7-vue'
import { mapGetters } from 'vuex'
import * as R from 'ramda'
import delay from 'timeout-as-promise'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'

import { enableEmojiAutoComplete } from '../emoji'

dayjs.extend(weekOfYear)

export default {
  components: {
    f7Navbar, f7Page, f7Block, f7List, f7ListItem, f7NavRight, f7Link, f7Messages, f7Message, f7Preloader, f7Messagebar, f7MessagesTitle
  },
  computed: {
    ...mapGetters(['getPostText', 'getPersonNameById', 'getGroupById', 'getGroupNameById', 'getPostsByGroupId', 'isMyself', 'getPersonAvatar']),
    group: function () {
      return this.getGroupById(this.$route.params.id)
    },
    groupName: function () {
      return this.getGroupNameById(this.$route.params.id)
    }
  },
  data: function () {
    return {
      sending: false
    }
  },
  methods: {
    timestamp (creationTime) {
      const date = dayjs(creationTime)
      const today = dayjs(new Date())
      const yesterday = today.subtract(1, 'day')
      if (date.diff(today, 'days') === 0 && date.day() === today.day()) { // today
        return date.format('h:mm A')
      } else if (date.diff(yesterday, 'days') === 0 && date.day() === yesterday.day()) { // yesterday
        return 'Yesterday ' + date.format('h:mm A')
      } else if (date.year() === today.year() && date.week() === today.week()) { // this week
        return date.format('ddd h:mm A')
      } else if (date.year() === today.year()) { // this year
        return date.format('ddd MMM D h:mm A')
      } else { // past years
        return date.format('YYYY-MM-DD h:mm A')
      }
    },
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
    groupedPosts () {
      const posts = this.posts()
      if (R.isNil(posts)) {
        return undefined
      }
      return R.groupWith((post1, post2) => {
        return dayjs(post2.creationTime).diff(dayjs(post1.creationTime), 'minutes') === 0 // within the same minute
      }, posts)
    },
    goToRoot () {
      this.$router.push({ name: 'root' })
    },
    isImage (file) {
      return R.test(/\.(?:png|jpg|gif|bmp|tiff|jpeg)$/i, file.name)
    },
    async sendMessage () {
      if (this.textarea.val() === '') {
        return
      }
      const text = this.textarea.val()
      this.textarea.val('')
      this.sending = true
      await this.$store.dispatch('sendMessage', { groupId: this.$route.params.id, text })
      this.sending = false
    },
    async shareFile (e) {
      const file = e.target.files[0]
      await this.$store.dispatch('shareFile', { groupId: this.$route.params.id, file })
      e.target.value = ''
    },
    openPerson (id) {
      this.$router.push({ name: 'person', params: { id } })
    },
    isSupportedPost (post) {
      if (post.type === 'TextMessage') {
        if ((!R.isNil(post.text) && !R.isEmpty(post.text)) || (!R.isNil(post.attachments) && !R.isEmpty(post.attachments))) {
          return true
        }
      } else if (post.type === 'PersonsAdded') {
        if (!R.isNil(post.addedPersonIds) && !R.isEmpty(post.addedPersonIds)) {
          return true
        }
      }
      return false
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
          document.getElementById('send-button').click()
        }
      }
    })
    enableEmojiAutoComplete(this.textarea[0])
  }
}
</script>
