<template>
  <div class="page-content">
    <div class="messages" id="messages-list">
      <div class="progressbar-infinite color-green" v-if="loadingMore"></div>
      <template v-for="posts in groupedPosts()">
        <div class="messages-title">{{ timestamp(posts[0].creationTime) }}</div>
        <div class="message message-with-avatar" :class="isMyself(post.creatorId) ? 'message-sent' : 'message-received'" v-for="post in posts" :key="post.id">
          <div :style="'background-image:url(' + getPersonAvatar(post.creatorId) + ')'" class="message-avatar" @click="openPerson(post.creatorId)"></div>
          <div class="message-content">
            <div class="message-name">{{ getPersonNameById(post.creatorId) }}</div>
            <textarea v-if="current.editing && current.post.id === post.id" class="resizable" @input="current.text = $event.target.value" id="editing-textarea">{{ current.text }}</textarea>
            <div v-else class="wrapped-bubble">
              <a class="link popover-open" :class="{ 'margin-8': getTheme() === 'ios' }" data-popover=".popover-menu" v-if="post.text && isMyself(post.creatorId)" @click="changeCurrent(post)">
                <i class="f7-icons ios-only size-20">more_vertical</i>
                <i class="material-icons md-only size-20">more_vert</i>
              </a>
              <div class="message-bubble">
                <template v-if="post.type === 'TextMessage'">
                  <div class="message-text" v-if="post.text" v-html="getPostText(post)"></div>
                  <div v-if="post.attachments">
                    <template v-for="a in post.attachments">
                      <a v-if="a.contentUri" :href="a.contentUri" class="external" target="_blank">
                        <img v-if="isImage(a)" :src="a.contentUri" class="attachment-image"/>
                        <span v-else>{{ a.name }}</span>
                      </a>
                      <div v-else-if="a.type === 'Card'">
                        {{ a.text }}
                      </div>
                    </template>
                  </div>
                </template>
                <template v-if="post.type === 'PersonsAdded'">
                  <div class="message-text" v-if="post.addedPersonIds" v-html="getPostText(post)"></div>
                </template>
                <div v-if="!isSupportedPost(post)">Unsupported message</div>
              </div>
              <a class="link popover-open" :class="{ 'margin-8': getTheme() === 'ios' }" data-popover=".popover-menu" v-if="post.text && !isMyself(post.creatorId)" @click="changeCurrent(post)">
                <i class="f7-icons ios-only size-20">more_vertical</i>
                <i class="material-icons md-only size-20">more_vert</i>
              </a>
            </div>
          </div>
        </div>
      </template>
      <div v-if="!posts" class="block text-align-center">
        <preloader></preloader>
      </div>
    </div>
    <div class="popover popover-menu">
      <div class="popover-inner">
        <div class="list" v-if="current.post">
          <ul>
            <li v-if="current.post.text && isMyself(current.post.creatorId)">
              <a class="list-button popover-close" @click="editPost">Edit</a>
            </li>
            <li v-if="current.post.text">
              <a class="list-button popover-close" @click="quotePost">Quote</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as R from 'ramda'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { mapGetters } from 'vuex'
import debounce from 'lodash.debounce'
import delay from 'timeout-as-promise'
import { Dom7 } from 'framework7'

import Preloader from './Preloader.vue'
import framework7 from '../framework7'

dayjs.extend(weekOfYear)

export default {
  components: {
    Preloader
  },
  props: ['posts'],
  data: function () {
    return {
      loadingMore: false,
      current: {
        post: undefined,
        editing: false,
        text: undefined
      }
    }
  },
  computed: {
    ...mapGetters(['getTheme', 'isMyself', 'getPersonAvatar', 'getPersonNameById', 'getPostText', 'getPostsByGroupId']),
    latestPostId: function () {
      const posts = this.getPostsByGroupId(this.$route.params.id)
      if (R.isNil(posts) || R.isEmpty(posts)) {
        return undefined
      }
      return posts[0].id
    }
  },
  watch: {
    latestPostId: async function (val) { // scroll to bottom upon new post
      await delay(100)
      this.messagesList.scroll(100, 1000000)
    }
  },
  methods: {
    changeCurrent (post) {
      this.current.post = post
      this.current.editing = false
      this.current.text = undefined
    },
    openPerson (id) {
      this.$router.push({ name: 'person', params: { id } })
    },
    quotePost () {
      const textarea = Dom7('#messagebar-textarea')
      const text = `![:Person](${this.current.post.creatorId}) wrote:\n` + this.current.post.text.split('\n').map(line => `> ${line}`).join('\n') + '\n\n'
      console.log('quotePost', text)
      console.log(textarea)
      textarea.val(text)
      textarea.trigger('change')
      textarea.focus()
    },
    async editPost () {
      this.current.editing = true
      this.current.text = this.current.post.text
      await delay(100)
      const textarea = Dom7('#editing-textarea')
      textarea.trigger('change')
      textarea.on('keydown', (e) => {
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
    groupedPosts () {
      if (R.isNil(this.posts)) {
        return undefined
      }
      return R.groupWith((post1, post2) => {
        return dayjs(post2.creationTime).diff(dayjs(post1.creationTime), 'minutes') === 0 // within the same minute
      }, this.posts)
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
    },
    isImage (file) {
      return R.test(/\.(?:png|jpg|gif|bmp|tiff|jpeg)$/i, file.name)
    }
  },
  async mounted () {
    this.messagesList = framework7.messages.create({
      el: '#messages-list',
      scrollMessages: false
    })
    const messagesListEl = this.messagesList.$pageContentEl
    const debouncedScroll = debounce(async (e) => {
      const topElement = messagesListEl.find('.message-content')[0]
      const top = topElement.getBoundingClientRect().top
      if (top >= 60) {
        this.loadingMore = true
        await this.$store.dispatch('fetchMorePosts', this.$route.params.id)
        this.loadingMore = false
        this.messagesList.scroll(0, topElement.getBoundingClientRect().top - top - 32)
      }
    }, 100)
    messagesListEl.on('scroll', debouncedScroll)

    this.messagesList.scroll(0, 1000000)
  }
}
</script>
