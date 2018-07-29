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
        <div class="title">{{ groupName }}<span v-if="group.type === 'Team'"> ({{ group.members.length }})</span></div>
        <div class="right"></div>
      </div>
    </div>
    <messagebar :group="group" ref="messagebar"></messagebar>
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
                        <a :href="file.contentUri" class="external" target="_blank">
                          <img v-if="isImage(file)" :src="file.contentUri" class="attachment-image"/>
                          <span v-else>{{ file.name }}</span>
                        </a>
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
        <div v-if="!posts()" class="block text-align-center">
          <preloader></preloader>
        </div>
      </f7-messages>
      <f7-popover class="popover-menu">
        <f7-list v-if="current.post">
          <f7-list-item v-if="current.post.text && isMyself(current.post.creatorId)" link="#" popover-close title="Edit" @click="editPost"></f7-list-item>
          <f7-list-item v-if="current.post.text" link="#" popover-close title="Quote" @click="quotePost"></f7-list-item>
        </f7-list>
      </f7-popover>
    </div>
  </div>
  <div v-else class="block text-align-center">
    <preloader></preloader>
  </div>
</template>

<script>
import { f7List, f7ListItem, f7Link, f7Messages, f7Message, f7MessagesTitle, f7Icon, f7Popover, f7Input } from 'framework7-vue'
import { mapGetters } from 'vuex'
import * as R from 'ramda'
import delay from 'timeout-as-promise'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import debounce from 'lodash.debounce'

import Preloader from './Preloader.vue'
import Messagebar from './Messagebar.vue'

dayjs.extend(weekOfYear)

export default {
  components: {
    Preloader, Messagebar, f7List, f7ListItem, f7Link, f7Messages, f7Message, f7MessagesTitle, f7Icon, f7Popover, f7Input
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
      this.$refs.messagebar.setText(`![:Person](${this.current.post.creatorId}) wrote:\n` + this.current.post.text.split('\n').map(line => `> ${line}`).join('\n') + '\n\n')
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
    this.$store.dispatch('fetchGroup', this.$route.params.id)
    while (R.isNil(this.group)) {
      await delay(1000)
    }
    this.$store.dispatch('fetchPersons', this.group.members)

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
