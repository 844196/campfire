<template lang="pug">
#memos
  memo-list.memo-list(:memos="memos")
  router-view.router-view
</template>

<script lang="ts">
import Vue from 'vue'
import MemoList from '@/components/MemoList.vue'
import { memosHelpers } from '@/store/memos'

export default Vue.extend({
  name: 'Memos',
  components: {
    MemoList
  },
  computed: {
    ...memosHelpers.mapGetters({ memos: 'all' })
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

  .router-view
    height: 100%
    flex: 1
</style>
