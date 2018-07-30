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
    <messages :posts="posts()"></messages>
  </div>
  <div v-else class="block text-align-center">
    <preloader></preloader>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as R from 'ramda'
import delay from 'timeout-as-promise'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'

import Preloader from './Preloader.vue'
import Messagebar from './Messagebar.vue'
import Messages from './Messages.vue'

dayjs.extend(weekOfYear)

export default {
  components: {
    Preloader, Messagebar, Messages
  },
  computed: {
    ...mapGetters(['getTotalUnreadCounts', 'getGroupById', 'getGroupNameById', 'getPostsByGroupId']),
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
    }
  },
  async mounted () {
    this.$store.dispatch('fetchGroup', this.$route.params.id)
    while (R.isNil(this.group)) {
      await delay(1000)
    }
    this.$store.dispatch('fetchPersons', this.group.members)

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
