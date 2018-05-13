<template lang="pug">
.memo-editor
  .column-wrapper
    memo-editor-textarea.column.textarea(v-model="cachedContent")
    anydown.column.previewer(:uuid="memo.uuid", v-model="cachedContent")
  memo-editor-sidebar(:storeState="storeState")
</template>

<script lang="ts">
import Vue from 'vue'
import Anydown from '@/components/molecules/Anydown.vue'
import MemoEditorTextarea from '@/components/atoms/MemoEditorTextarea.vue'
import MemoEditorSidebar, { StoreState } from '@/components/atoms/MemoEditorSidebar.vue'
import { debounce } from 'lodash'
import Memo from '@/models/memo'
import { memosHelpers } from '@/store/memos'

export default Vue.extend({
  name: 'MemoEditor',
  components: {
    MemoEditorTextarea,
    MemoEditorSidebar,
    Anydown
  },
  props: {
    memo: {
      type: Object as () => Memo,
      required: true
    }
  },
  data () {
    return {
      cached: this.memo,
      storeState: StoreState.DOING
    }
  },
  computed: {
    cachedContent: {
      get (): string {
        return this.cached.content
      },
      async set (value: string) {
        this.cached.content = value
        this.memo.content = value
        this.storeState = StoreState.DOING
        await this.createOrUpdate()
      }
    }
  },
  watch: {
    memo () {
      this.cached = this.memo
      this.storeState = StoreState.COMPLETED
    }
  },
  methods: {
    ...memosHelpers.mapActions({
      '_createOrUpdate': 'createOrUpdate'
    }),
    createOrUpdate: debounce(async function (this: any) {
      await this._createOrUpdate({ memo: this.memo })
    }, 750, { leading: false, trailing: true })
  }
})
</script>

<style lang="stylus" scoped>
.memo-editor
  display: flex

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
