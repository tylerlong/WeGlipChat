<template>
  <div class="page">
    <tabs active="contacts"></tabs>
    <div class="page-content">
      <div class="list media-list" v-if="persons && persons.length > 0">
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
        <Preloader></Preloader>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Tabs from './Tabs.vue'
import Preloader from './Preloader.vue'

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
  }
}
</script>
