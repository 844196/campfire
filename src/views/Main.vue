<template lang="pug">
div#app
  div#app-sidebar
    router-link.app-sidebar-item(:to="{ name: 'new' }")
      v-icon(name="plus")
  main#main
    router-view
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Main'
})
</script>

<style lang="stylus">
html, body
  height: 100%
</style>

<style lang="stylus" scoped>
#app
  height: 100%
  display: flex

  #app-sidebar
    height: 100%
    background-color: #0747a6
    padding: 13px
    .app-sidebar-item
      color: #deebff
      display: flex
      justify-content: center
      align-items: center
      line-height: 1
      text-align: center
      padding: 7px
      &:hover
        background-color: rgba(9, 30, 66, .42)
        border-radius: 50%

  #main
    height: 100%
    flex: 1
</style>
