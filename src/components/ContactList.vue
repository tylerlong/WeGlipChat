<template>
  <div class="page">
    <tabs active="contacts"></tabs>
    <form class="searchbar">
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
      <div class="list media-list searchbar-found" v-if="persons && persons.length > 0">
        <ul>
          <li v-for="person in persons" :key="person.id" @click="openPerson(person.id)">
            <div class="item-content">
              <div class="item-media">
                <img :src="getPersonAvatar(person.id)" class="avatar-image">
              </div>
              <div class="item-inner">
                <div class="item-title-row">
                  <div class="item-title">{{ person.name }}</div>
                  <div class="item-after"></div>
                </div>
                <div class="item-subtitle"></div>
                <div class="item-text">{{ person.email }}</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="block text-align-center">
        <preloader></preloader>
      </div>
      <div class="block searchbar-not-found">
        <div class="block-inner">Nobody matched</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Tabs from './Tabs.vue'
import Preloader from './Preloader.vue'
import framework7 from '../framework7'

export default {
  components: {
    Tabs, Preloader
  },
  computed: {
    ...mapGetters(['getPersons', 'getPersonAvatar']),
    persons: function () {
      return this.getPersons()
    }
  },
  methods: {
    openPerson (id) {
      this.$router.push({ name: 'person', params: { id } })
    }
  },
  mounted: function () {
    this.searchbar = framework7.searchbar.create({
      el: '.searchbar',
      searchContainer: '.list',
      searchIn: '.item-title'
    })
  }
}
</script>
