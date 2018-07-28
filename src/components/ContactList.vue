<template>
  <f7-page :page-content="false">
    <tabs active="contacts"></tabs>
    <div class="page-content">
      <f7-list media-list v-if="persons">
        <f7-list-item
          link="#"
          :title="person.name"
          :text="person.email"
          v-for="person in persons"
          :key="person.id"
          @click="openPerson(person.id)"
        >
        <img slot="media" :src="getPersonAvatar(person.id)" class="avatar-image" />
        </f7-list-item>
      </f7-list>
      <f7-block v-else class="text-align-center">
        <Preloader></Preloader>
      </f7-block>
    </div>
  </f7-page>
</template>

<script>
import { f7Page, f7List, f7Block, f7ListItem } from 'framework7-vue'
import { mapGetters } from 'vuex'

import Tabs from './Tabs.vue'
import Preloader from './Preloader.vue'

export default {
  components: {
    f7Page, f7List, f7Block, f7ListItem, Tabs, Preloader
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
