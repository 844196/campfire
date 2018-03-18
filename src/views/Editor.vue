<template lang="pug">
#editor
  textarea.textarea(v-model="memo.content", @input="onInput")
  previewer.previewer(v-model="cached")
</template>

<script lang="ts">
import Vue from 'vue'
import Previewer from '@/components/Previewer.vue'
import { debounce } from 'throttle-debounce'
import { Memo } from '@/domain/memo'

export default Vue.extend({
  name: 'Editor',
  components: {
    Previewer
  },
  props: {
    memo: {
      type: Object,
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
    async onInput () {
      this.cached = this.memo.content
      await this.createOrUpdate()
    },
    createOrUpdate: debounce(750, async function (this: any) {
      await this.$store.dispatch('memos/createOrUpdate', {
        memo: this.memo
      })
      await this.$store.dispatch('snackbar/show', {
        message: 'Autosave completed',
        duration: 2000
      })
    })
  }
})
</script>

<style lang="stylus" scoped>
#editor
  height: 100%
  display: grid
  grid-template-rows: 100%
  grid-template-columns: 50% 50%
  grid-gap: .5em

  .textarea
    height: 100%
    border: none
    grid-column: 1 / 2
    resize: none
    font-size: 13px
    font-family: Consolas,Liberation Mono,Menlo,Courier,monospace
    line-height: 1.5
    &:focus
      outline: 0

  .previewer
    height: 100%
    overflow-y: auto
    grid-column: 2 / 2
</style>
