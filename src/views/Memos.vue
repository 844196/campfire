<template lang="pug">
#memos
  memo-list.memo-list(:memos="memos", :class="{ hide: !memoListDisplay }")
  router-view.router-view
</template>

<script lang="ts">
import Vue from 'vue'
import MemoList from '@/components/MemoList.vue'
import { memosHelpers } from '@/store/memos'
import { memoListHelpers } from '@/store/memo-list'

export default Vue.extend({
  name: 'Memos',
  components: {
    MemoList
  },
  computed: {
    ...memosHelpers.mapGetters({ memos: 'all' }),
    ...memoListHelpers.mapGetters({ memoListDisplay: 'display' })
  },
  created () {
    this._initMemos(undefined)
  },
  methods: {
    ...memosHelpers.mapActions({ _initMemos: 'init' })
  }
})
</script>

<style lang="stylus" scoped>
#memos
  display: flex
  height: 100%

  .memo-list
    height: 100%
    width: 16rem
    &.hide
      width: 0
      overflow: hidden
      padding: 0

  .router-view
    height: 100%
    flex: 1
</style>
