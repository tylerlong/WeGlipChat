<template>
  <div class="page" v-if="group">
    <div class="navbar">
      <div class="navbar-inner sliding">
        <div class="left">
          <a href="#" class="back icon-only link" @click="goToRoot">
            <i class="icon icon-back">
              <span v-if="getTotalUnreadCounts()" class="badge color-red">{{ getTotalUnreadCounts() }}</span>
            </i>
          </a>
        </div>
        <div class="title">{{ groupName }}</div>
      </div>
    </div>
    <f7-messagebar placeholder="Message" ref="messagebar">
      <input id="file-input" style="display: none;" type="file" @change="shareFile"/>
      <f7-link
        icon-if-ios="f7:share_fill"
        icon-if-md="material:attachment"
        slot="inner-start"
        onclick="document.getElementById('file-input').click()"
      ></f7-link>
      <f7-link
        icon-if-ios="f7:paper_plane_fill"
        icon-if-md="material:send"
        slot="inner-end"
        @click="sendMessage"
        title="Send"
        id="send-button"
        v-if="!sending"
      ></f7-link>
      <f7-preloader color="orange" v-else size="24" class="sending-loader"></f7-preloader>
    </f7-messagebar>
    <div class="page-content">
      <f7-messages ref="messageList" :scroll-messages="false">
        <div class="progressbar-infinite color-green" v-if="loadingMore"></div>
        <template v-for="posts in groupedPosts()">
          <f7-messages-title>{{ timestamp(posts[0].creationTime) }}</f7-messages-title>
          <div class="message message-with-avatar" :class="isMyself(post.creatorId) ? 'message-sent' : 'message-received'" v-for="post in posts" :key="post.id">
            <div :style="'background-image:url(' + getPersonAvatar(post.creatorId) + ')'" class="message-avatar" @click="openPerson(post.creatorId)"></div>
            <div class="message-content">
              <div class="message-name">{{ getPersonNameById(post.creatorId) }}</div>
              <f7-input type="textarea" v-if="current.editing && current.post.id === post.id" :resizable="true" :value="current.text" @input="current.text = $event.target.value" ref="editingTextarea"></f7-input>
              <div v-else class="wrapped-bubble">
                <f7-link :class="{ 'margin-12': $theme.ios }" popover-open=".popover-menu" v-if="post.text && isMyself(post.creatorId)" @click="changeCurrent(post)">
                  <f7-icon size="25" if-ios="f7:more_vertical" if-md="material:more_vert"></f7-icon>
                </f7-link>
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
                <f7-link :class="{ 'margin-12': $theme.ios }" popover-open=".popover-menu" v-if="post.text && !isMyself(post.creatorId)" @click="changeCurrent(post)">
                  <f7-icon size="25" if-ios="f7:more_vertical" if-md="material:more_vert"></f7-icon>
                </f7-link>
              </div>
            </div>
          </div>
        </template>
        <f7-block v-if="!posts()" class="text-align-center">
          <f7-preloader color="orange"></f7-preloader>
        </f7-block>
      </f7-messages>
      <f7-popover class="popover-menu">
        <f7-list v-if="current.post">
          <f7-list-item v-if="current.post.text && isMyself(current.post.creatorId)" link="#" popover-close title="Edit" @click="editPost"></f7-list-item>
          <f7-list-item v-if="current.post.text" link="#" popover-close title="Quote" @click="quotePost"></f7-list-item>
        </f7-list>
      </f7-popover>
    </div>
  </div>
  <f7-block v-else class="text-align-center">
    <f7-preloader color="orange"></f7-preloader>
  </f7-block>
</template>

<script>
import { f7Block, f7List, f7ListItem, f7Link, f7Messages, f7Message, f7Preloader, f7Messagebar, f7MessagesTitle, f7Icon, f7Popover, f7Input } from 'framework7-vue'
import { mapGetters } from 'vuex'
import * as R from 'ramda'
import delay from 'timeout-as-promise'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import debounce from 'lodash.debounce'

import { enableEmojiAutoComplete } from '../emoji'
import { enableMentionAutoComplete } from '../mention'

dayjs.extend(weekOfYear)

export default {
  components: {
    f7Block, f7List, f7ListItem, f7Link, f7Messages, f7Message, f7Preloader, f7Messagebar, f7MessagesTitle, f7Icon, f7Popover, f7Input
  },
  computed: {
    ...mapGetters(['getPostText', 'getPersonNameById', 'getGroupById', 'getGroupNameById', 'getPostsByGroupId', 'isMyself', 'getPersonAvatar', 'getTotalUnreadCounts']),
    group: function () {
      return this.getGroupById(this.$route.params.id)
    },
    groupName: function () {
      return this.getGroupNameById(this.$route.params.id)
    },
    latestPostId: function () {
      const posts = this.getPostsByGroupId(this.$route.params.id)
      if (R.isNil(posts) || R.isEmpty(posts)) {
        return undefined
      }
      return posts[0].id
    }
  },
  data: function () {
    return {
      sending: false,
      loadingMore: false,
      current: {
        post: undefined,
        editing: false,
        text: undefined
      }
    }
  },
  watch: {
    latestPostId: async function (val) { // scroll to bottom upon new post
      await delay(100)
      this.$refs.messageList.f7Messages.scroll(100, 1000000)
    }
  },
  methods: {
    changeCurrent (post) {
      this.current.post = post
      this.current.editing = false
      this.current.text = undefined
    },
    quotePost () {
      this.textarea.val(`![:Person](${this.current.post.creatorId}) wrote:\n` + this.current.post.text.split('\n').map(line => `> ${line}`).join('\n'))
      this.textarea.trigger('change')
      this.textarea.focus()
    },
    async editPost () {
      this.current.editing = true
      this.current.text = this.current.post.text
      await delay(100)
      const textarea = this.$refs.editingTextarea[0].$el.querySelector('textarea')
      textarea.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
          if (!e.shiftKey) {
            e.preventDefault()
            this.$store.dispatch('updatePostText', {
              groupId: this.$route.params.id,
              postId: this.current.post.id,
              text: this.current.text
            })
            this.changeCurrent(undefined)
          }
        } else if (e.keyCode === 27) {
          this.changeCurrent(undefined)
        }
      })
    },
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
      this.textarea.trigger('change')
      this.sending = true
      await this.$store.dispatch('sendMessage', { groupId: this.$route.params.id, text })
      this.sending = false
    },
    async shareFile (e) {
      const file = e.target.files[0]
      this.sending = true
      await this.$store.dispatch('shareFile', { groupId: this.$route.params.id, file })
      this.sending = false
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
    enableMentionAutoComplete(this.textarea[0], this.group.members.map(id => ({ id, name: this.getPersonNameById(id) })))

    const $f7Messages = this.$refs.messageList.f7Messages
    const messagesListEl = $f7Messages.$pageContentEl
    const debouncedScroll = debounce(async (e) => {
      const topElement = messagesListEl.find('.message-content')[0]
      const top = topElement.getBoundingClientRect().top
      if (top >= 60) {
        this.loadingMore = true
        await this.$store.dispatch('fetchMorePosts', this.$route.params.id)
        this.loadingMore = false
        $f7Messages.scroll(0, topElement.getBoundingClientRect().top - top - 32)
      }
    }, 100)
    messagesListEl.on('scroll', debouncedScroll)

    $f7Messages.scroll(0, 1000000)

    this.$store.commit('updateReadTimestamp', this.$route.params.id)
    this.readTimestampInterval = setInterval(() => {
      this.$store.commit('updateReadTimestamp', this.$route.params.id)
    }, 3000)
  },
  beforeDestroy: function () {
    clearInterval(this.readTimestampInterval)
  }
}
</script>
