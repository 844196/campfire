<template lang="pug">
.memo-editor
  .column-wrapper(:style="{ 'grid-template-columns': currentLayout.columns }")
    .column.textarea(:class="{ only: !currentLayout.showPreviewer }", v-show="currentLayout.showTextarea")
      memo-editor-textarea.padding-1em(v-model="cachedContent")
    .column.previewer(:class="{ only: !currentLayout.showTextarea }", v-show="currentLayout.showPreviewer")
      memo-editor-previewer.padding-1em(v-model="cachedContent")
  memo-editor-sidebar(:storeState="storeState", @changeLayout="changeLayout")
</template>

<script lang="ts">
import Vue from 'vue'
import MemoEditorSidebar, { StoreState } from '@/components/MemoEditorSidebar.vue'
import MemoEditorTextarea from '@/components/MemoEditorTextarea.vue'
import MemoEditorPreviewer from '@/components/MemoEditorPreviewer.vue'
import { debounce } from 'lodash'
import Memo from '@/models/memo'
import { memosHelpers } from '@/store/memos'

// eslint-disable-next-line wrap-iife
const layouts = function * () {
  while (true) {
    yield * [
      {
        showTextarea: true,
        showPreviewer: true,
        columns: '50% 50%'
      },
      {
        showTextarea: true,
        showPreviewer: false,
        columns: '100%'
      },
      {
        showTextarea: false,
        showPreviewer: true,
        columns: '100%'
      }
    ]
  }
}()

export default Vue.extend({
  name: 'MemoEditor',
  components: {
    MemoEditorSidebar,
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
      cached: this.memo,
      storeState: StoreState.COMPLETED,
      currentLayout: layouts.next().value
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
    changeLayout () {
      this.currentLayout = layouts.next().value
    },
    createOrUpdate: debounce(async function (this: any) {
      this._createOrUpdate({ memo: this.memo })
        .then(() => {
          this.$toasted.show('保存しました', { icon: 'done' })
          this.storeState = StoreState.COMPLETED
        })
        .catch(() => {
          this.$toasted.error('保存に失敗しました', { icon: 'error' })
          this.storeState = StoreState.FAILED
        })
    }, 750, { leading: false, trailing: true })
  }
})
</script>

<style lang="stylus" scoped>
.memo-editor
  display: flex

.padding-1em
  padding: 1em

.column-wrapper
  display: grid
  grid-template-rows: 100%
  width: 100%
  height: 100%
  .column
    &>*
      height: 100%
    &>*:after
      display: block
      content: ''
      height: 1em

  .textarea
    font-size: 13px
    line-height: 1.5
    overflow-y: scroll
    &::-webkit-scrollbar-track
      background-color: #f2f2f2

  .previewer
    overflow-y: auto
    &>*
      font-size: 14px

  .textarea, .previewer
    &::-webkit-scrollbar
      width: 7px
    &::-webkit-scrollbar-thumb
      background-color: #bebebe
      border-radius: 3.5px
      &:hover
        background-color: #727272

  .column.textarea.only
    &>*
      margin: 0 auto
      max-width: 992px
    &::-webkit-scrollbar-track
      background-color: unset
  .column.previewer.only
    &>*
      margin: 0 auto
      max-width: 992px
</style>
