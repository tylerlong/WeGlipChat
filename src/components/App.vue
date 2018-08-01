<template>
  <div class="page">
    <tabs active="glip"></tabs>
    <form class="searchbar" id="groups-searchbar">
      <div class="searchbar-inner">
        <div class="searchbar-input-wrap">
          <input type="search" placeholder="Search">
          <i class="searchbar-icon"></i>
          <span class="input-clear-button"></span>
        </div>
        <span class="searchbar-disable-button">Cancel</span>
      </div>
    </form>
    <div class="page-content">
      <div class="searchbar-backdrop"></div>
      <div id="groups-list" class="list media-list searchbar-found" v-if="groups">
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
      <div class="list simple-list searchbar-not-found">
        <ul>
          <li>No group matched</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import * as R from 'ramda'

import Tabs from './Tabs.vue'
import Preloader from './Preloader.vue'
import framework7 from '../framework7'

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
  },
  mounted: function () {
    this.searchbar = framework7.searchbar.create({
      el: '#groups-searchbar',
      searchContainer: '#groups-list',
      searchIn: '.item-title'
    })
  },
  watch: { // fix refresh page issue
    groups: function (newVal, oldVal) {
      if (R.isNil(oldVal) || R.isEmpty(oldVal)) {
        setTimeout(() => {
          this.searchbar = framework7.searchbar.create({
            el: '#groups-searchbar',
            searchContainer: '#groups-list',
            searchIn: '.item-title'
          })
        }, 1000)
      }
    }
  }
}
</script>
