<template lang="pug">
#root
  router-view
  Snackbar
</template>

<script>
import Vue from 'vue'
import Snackbar from '@/components/Snackbar.vue'

export default Vue.extend({
  name: 'App',
  components: {
    Snackbar
  }
})
</script>

<style lang="stylus" scoped>
#root
  height: 100%
</style>
