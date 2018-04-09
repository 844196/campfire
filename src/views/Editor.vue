<template lang="pug">
#editor
  textarea.textarea(v-model="memo.content", @input="onInput")
  previewer.previewer(:value="{ content: cached, uuid: memo.uuid }")
</template>

<script lang="ts">
import Vue from 'vue'
import Previewer from '@/components/Previewer.vue'
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
.textarea
  padding: 0 // reset
  width: 50%
  border: 0
  resize: none
  font-size: 13px
  line-height: 1.5
  font-family: Consolas,Liberation Mono,Menlo,Courier,monospace
  height: 100%
  &:focus
    outline: none !important
.previewer
  overflow-y: auto
  width: 50%
</style>
