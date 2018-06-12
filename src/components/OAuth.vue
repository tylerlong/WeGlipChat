<template>
  <el-dialog title="Log In" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
  </el-dialog>
</template>

<script>
  export default {
    data: function () {
      return {
        visible: true
      }
    }
  }
</script>
