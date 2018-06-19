<template>
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
</template>

<script>
import { mapState } from 'vuex'
import { f7List, f7ListItem } from 'framework7-vue'

export default {
  components: {
    f7List, f7ListItem
  },
  computed: {
    ...mapState(['groups'])
  }
}
</script>
