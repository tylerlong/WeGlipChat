<template>
  <div>
    <p>Welcome!</p>
  </div>
</template>

<script>
import rc from '../api/ringcentral'

export default {
  data: function () {
    return {
      authorized: false
    }
  },
  mounted: async function () {
    const authorized = await rc.authorized()
    if (!authorized) {
      this.$router.push('/login/')
    }
  }
}
</script>
