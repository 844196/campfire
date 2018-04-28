<template lang="pug">
.memo-editor
  .column-wrapper
    memo-editor-textarea.column.textarea(v-model="memo.content", @input="onInput")
    memo-editor-previewer.column.previewer(:value="{ content: cached, uuid: memo.uuid }")
</template>

<script lang="ts">
import Vue from 'vue'
import MemoEditorPreviewer from '@/components/MemoEditorPreviewer.vue'
import MemoEditorTextarea from '@/components/MemoEditorTextarea.vue'
import { debounce } from 'throttle-debounce'
import Memo from '@/models/memo'
import { memosHelpers } from '@/store/memos'

export default Vue.extend({
  name: 'MemoEditor',
  components: {
    MemoEditorTextarea,
    MemoEditorPreviewer
  },
  props: {
    memo: {
      type: Object as () => Memo,
      required: true
    }
  },
  data () {
    return {
      cached: this.memo.content
    }
  },
  watch: {
    'memo' (nv) {
      this.cached = nv.content
    }
  },
  methods: {
    ...memosHelpers.mapActions({
      '_createOrUpdate': 'createOrUpdate'
    }),
    onInput () {
      this.cached = this.memo.content
      this.createOrUpdate()
    },
    createOrUpdate: debounce(750, async function (this: any) {
      await this._createOrUpdate({ memo: this.memo })
    })
  }
})
</script>

<style lang="stylus" scoped>
.column-wrapper
  display: grid
  grid-template-rows: 100%
  grid-template-columns: 50% 50%
  width: 100%
  height: 100%
  .column
    padding: 1em
    height: 100%

  .textarea
    font-size: 13px
    line-height: 1.5
    overflow-y: scroll

  .previewer
    font-size: 14px
    overflow-y: auto

  .textarea, .previewer
    &::-webkit-scrollbar
      width: 7px
    &::-webkit-scrollbar-thumb
      background-color: #bebebe
      border-radius: 3.5px
      &:hover
        background-color: #727272

  .textarea
    &::-webkit-scrollbar-track
      background-color: #f2f2f2
</style>
