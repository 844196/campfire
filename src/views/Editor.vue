<template lang="pug">
#editor
  .column-wrapper
    textarea.column.textarea(v-model="memo.content", @input="onInput", v-show="layout.textarea", :style="{ gridColumn: layout.gridColumn}")
    previewer.column.previewer(:value="{ content: cached, uuid: memo.uuid }", v-show="layout.previewer", :style="{ gridColumn: layout.gridColumn}")
  nav.menu
    el-dropdown(@command="handleCommand")
      span
        v-icon(name="layout")
      el-dropdown-menu(slot="dropdown")
        el-dropdown-item(:command="1") エディタのみ
        el-dropdown-item(:command="2") プレビューのみ
        el-dropdown-item(:command="3") 両方
</template>

<script lang="ts">
import Vue from 'vue'
import Previewer from '@/components/Previewer'
import { debounce } from 'throttle-debounce'
import Memo from '@/models/memo'
import { memosHelpers } from '@/store/memos'
import { difference } from 'lodash'

export default Vue.extend({
  name: 'Editor',
  components: {
    Previewer
  },
  props: {
    memo: {
      type: Object as () => Memo,
      required: true
    }
  },
  data () {
    return {
      layout: {
        textarea: true,
        previewer: true,
        gridColumn: 'unset'
      },
      cached: this.memo.content
    }
  },
  watch: {
    'memo' (nv) {
      this.cached = nv.content
    }
  },
  created () {
    this.$store.watch(
      (_, getters?) => getters!['memos/all'],
      (after: Array<Memo>, before: Array<Memo>) => {
        const uuid = (m: Memo) => m.uuid.toString()
        const subDiff = difference(before.map(uuid), after.map(uuid))
        if (subDiff.includes(this.memo.uuid.toString())) this.$router.push('/')
      }
    )
  },
  methods: {
    ...memosHelpers.mapActions({
      '_createOrUpdate': 'createOrUpdate'
    }),
    async onInput () {
      this.cached = this.memo.content
      await this.createOrUpdate()
    },
    createOrUpdate: debounce(750, async function (this: any) {
      await this._createOrUpdate({ memo: this.memo })
    }),
    handleCommand (type: number) {
      if (type === 1) {
        this.layout = { textarea: true, previewer: false, gridColumn: '1 / span 2' }
      }
      if (type === 2) {
        this.layout = { textarea: false, previewer: true, gridColumn: '1 / span 2' }
      }
      if (type === 3) {
        this.layout = { textarea: true, previewer: true, gridColumn: 'unset' }
      }
    }
  }
})
</script>

<style lang="stylus" scoped>
#editor
  height: 100%
  display: flex
.menu
  height: 100%
  display: flex
  padding: 0 .5em .5em 0
  flex-direction: column
  justify-content: flex-end
  .icon
    color: #d6d6d6
    width: 24px
    transition: all .2s
    &:hover
      transition: all .2s
      color: #a6a6a6
.column-wrapper
  display: grid
  grid-template-rows: 100%
  grid-template-columns: 50% 50%
  width: 100%
  .column
    padding: 1em
    height: 100%
    overflow-y: auto
    &::-webkit-scrollbar
      width: 12px
    &::-webkit-scrollbar-thumb
      background-color: white
      border-radius: 6px
      box-shadow: 0px 0px 0px 3px white inset
    &:hover
      &::-webkit-scrollbar
        width: 12px
      &::-webkit-scrollbar-thumb
        background-color: #bebebe
        border-radius: 6px
        box-shadow: 0px 0px 0px 3px white inset
.textarea
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  border: 0
  resize: none
  font-size: 13px
  line-height: 1.5
  font-family: Consolas,Liberation Mono,Menlo,Courier,monospace
  &:focus
    outline: none !important
.previewer
  font-size: 14px
  background-color: unset
</style>
