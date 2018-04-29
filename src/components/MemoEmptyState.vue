<template lang="pug">
.memo-empty-state
  v-icon.state-icon(name="file-text")
  div.state-label ようこそ、担当職員様
  div.state-description ご希望のファイルを選択してください
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'MemoEmptyState'
})
</script>

<style lang="stylus" scoped>
.memo-empty-state
  font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  color: #42526e

  .state-icon
    width: 9rem
    color: #0052cc

  .state-label
    font-size: 1.7em
    padding: .8rem 0 1.3rem 0

  .state-description
    font-size: .8em
</style>
