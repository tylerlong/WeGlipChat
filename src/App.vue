<template>
  <div>
    <p>Welcome!</p>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  data: function () {
    return {
      authorized: false
    }
  },
  mounted: function () {
    const accessToken = Cookies.get('RINGCENTRAL_ACCESS_TOKEN')
    if (accessToken === undefined) {
      this.$router.push('/login/')
    }
  }
}
</script>
