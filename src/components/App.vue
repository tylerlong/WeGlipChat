<template>
  <div class="page">
    <tabs active="glip"></tabs>
    <div class="page-content">
      <div class="list media-list" v-if="groups">
        <ul>
          <li v-for="group in groups" :key="group.id" @click="openGroup(group.id)">
            <div class="item-content">
              <div class="item-media">
                <img :src="getGroupAvatar(group)" class="avatar-image">
              </div>
              <div class="item-inner">
                <div class="item-title-row">
                  <div class="item-title">{{ getGroupNameById(group.id) }}</div>
                  <div class="item-after"><span class="badge color-red" v-if="getUnreadCounts(group.id)">{{ getUnreadCounts(group.id) }}</span></div>
                </div>
                <div class="item-subtitle"></div>
                <div class="item-text">{{ getGroupMessagePreviewText(group) }}</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="block text-align-center">
        <preloader></preloader>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import Tabs from './Tabs.vue'
import Preloader from './Preloader.vue'

export default {
  components: {
    Tabs, Preloader
  },
  computed: {
    ...mapState(['groups']),
    ...mapGetters(['getGroupNameById', 'getGroupAvatar', 'getGroupMessagePreviewText', 'getUnreadCounts'])
  },
  methods: {
    openGroup (id) {
      this.$router.push({ name: 'group', params: { id } })
    }
  }
}
</script>
