<template>
  <div>
    <p>You are <span v-if="authorized">authorized</span><span v-else>unauthorized</span>.</p>
    <button v-on:click="authorize">Authorize</button>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      authorized: false
    }
  },
  methods: {
    authorize: function () {
      this.authorized = true
    }
  }
}
</script>
