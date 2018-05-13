<template lang="pug">
.memo-editor-sidebar
  .item.store-state
    v-icon(name="server")
    svg.indicator(width="20", height="20", :class="storeState")
      circle(cx="10", cy="10", r="3.5", fill-rule="evenodd")
</template>

<script lang="ts">
import Vue from 'vue'

export enum StoreState {
  DOING = 'doing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export default Vue.extend({
  name: 'MemoEditorSidebar',
  props: {
    storeState: {
      validator (_: StoreState): boolean {
        return true
      }
    }
  }
})
</script>

<style lang="stylus" scoped>
.memo-editor-sidebar
  background-color: #f4f5f7
  padding: 20px 4px 4px 4px

  .item
    display: flex
    justify-content: center
    align-items: center
    line-height: 1
    text-align: center
    padding: 10px 20px
    color: #7a869a
    flex-direction: column
    flex-wrap: wrap
  .item.store-state
    padding: 0 20px
    .indicator.doing
      fill: #ffab00
    .indicator.completed
      fill: #36b37e
    .indicator.failed
      fill: #ff5630
</style>
