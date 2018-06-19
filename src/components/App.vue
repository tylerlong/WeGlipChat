<template>
  <div>
    <p>Welcome<span v-if="extension"> {{ extension.name }}</span>!</p>
    <p><f7-button fill v-if="token" @click="logOut">Log Out</f7-button></p>
    <f7-list media-list v-if="groups">
      <f7-list-item
        link="#"
        title="Yellow Submarine"
        after="$15"
        subtitle="Beatles"
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus."
        v-for="group in groups"
        :key="group.id"
      >
        <img slot="media" src="http://via.placeholder.com/160x160" width="80" />
      </f7-list-item>
    </f7-list>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { f7Button, f7List, f7ListItem } from 'framework7-vue'

export default {
  components: {
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
