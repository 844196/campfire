<template lang="pug">
#memos
  memo-list.memo-list(:memos="memos")
  memo-editor.memo-editor(:memo="memo")
</template>

<script lang="ts">
import Vue from 'vue'
import Memo from '@/models/memo'
import MemoEditor from '@/components/MemoEditor.vue'
import MemoList from '@/components/MemoList.vue'
import { memosHelpers } from '@/store/memos'

export default Vue.extend({
  name: 'Memos',
  components: {
    MemoList,
    MemoEditor
  },
  props: {
    memo: {
      type: Object as () => Memo,
      required: true
    }
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
    width: 18rem

  .memo-editor
    height: 100%
    flex: 1
</style>
