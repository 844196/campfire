<template lang="pug">
#editor
  textarea.textarea(v-model="memo.content", @input="onInput")
  previewer.previewer(:value="{ content: cached, uuid: memo.uuid }")
</template>

<script lang="ts">
import Vue from 'vue'
import Previewer from '@/components/Previewer'
import { debounce } from 'throttle-debounce'
import Memo from '@/domain/memo'
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
    async onInput () {
      this.cached = this.memo.content
      await this.createOrUpdate()
    },
    createOrUpdate: debounce(750, async function (this: any) {
      await this.$store.dispatch('memos/createOrUpdate', {
        memo: this.memo
      })
    })
  }
})
</script>

<style lang="stylus" scoped>
#editor
  height: 100%
  display: flex
.textarea, .previewer
  height: 100%
  width: 50%
  overflow-y: auto
  background-color: white
  padding: 1em
.textarea
  background-color: #fbfbfb
  color: #2f2f2f
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  border: 0
  resize: none
  font-size: 13px
  line-height: 1.5
  font-family: Consolas,Liberation Mono,Menlo,Courier,monospace
  &:focus
    outline: none !important
</style>
