<template>
  <div class="toolbar tabbar">
    <div class="toolbar-inner">
      <a @click="openTab('root')" class="tab-link" :class="{ 'tab-link-active': active === 'glip' }">
        <i class="f7-icons ios-only">chat</i>
        <i class="material-icons md-only">chat</i>
      </a>
      <a @click="openTab('contacts')" class="tab-link" :class="{ 'tab-link-active': active === 'contacts' }">
        <i class="f7-icons ios-only">persons</i>
        <i class="material-icons md-only">group</i>
      </a>
      <a @click="openTab('settings')" class="tab-link" :class="{ 'tab-link-active': active === 'settings' }">
        <i class="f7-icons ios-only">settings</i>
        <i class="material-icons md-only">settings</i>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['active'],
  methods: {
    openTab: function (name) {
      this.$router.push({ name })
    }
  }
}
</script>
