<template>
  <f7-page>
    <p>Welcome<span v-if="extension"> {{ extension.name }}</span>!</p>
    <p><f7-button fill v-if="token" @click="logOut">Log Out</f7-button></p>
    <f7-list media-list v-if="groups">
      <f7-list-item
        link="#"
        :title="group.name || group.members.join(', ')"
        text="..."
        v-for="group in groups"
        :key="group.id"
      >
        <img slot="media" src="https://via.placeholder.com/64x64" width="42" />
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
import { mapState } from 'vuex'
import { f7Page, f7Button, f7List, f7ListItem } from 'framework7-vue'

export default {
  components: {
    f7Page,
    f7Button,
    f7List,
    f7ListItem
  },
  computed: {
    ...mapState(['token', 'extension', 'groups'])
  },
  methods: {
    logOut: function () {
      this.$store.commit('setToken', undefined)
    }
  }
}
</script>
