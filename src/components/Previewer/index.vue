<template lang="pug">
.previewer.markdown-body(v-html="rendered")
</template>

<script lang="ts">
import Vue from 'vue'
import MarkdownIt from 'markdown-it'
import { LooseMap2 } from '@/utils/map'
// import { throttle } from 'throttle-debounce'
import UUID from '@/utils/uuid'
import { isUMLFence, umlRenderer } from './renderer'
import { LazyResourceCache } from './lazy-resource'
import { LazyReplaceOrder, lazyReplacer } from './lazy-replacer'
import { debounce } from 'lodash'

const md = new MarkdownIt()
const originRenderer = md.renderer.rules.fence
md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
  const renderer = isUMLFence(tokens[idx]) ? umlRenderer : originRenderer
  return renderer(tokens, idx, options, env, slf)
}

export interface MarkdownDocument {
  content: string
  uuid: UUID
}

export default Vue.extend({
  name: 'Previewer',
  props: {
    value: {
      type: Object as () => MarkdownDocument,
      required: true
    }
  },
  data () {
    return {
      rendered: '',
      // eslint-disable-next-line space-infix-ops
      cacheStore: new LooseMap2<LazyResourceCache>()
    }
  },
  watch: {
    value: {
      handler (after: MarkdownDocument, before?: MarkdownDocument) {
        const isCreated = !before
        const isDocunemtChange = before && !before.uuid.isEqual(after.uuid)
        const isContentChange = after.content !== (before ? before.content : '')

        if (isDocunemtChange) {
          this.cacheStore.delAll()
        }

        if (!isContentChange) {
          return
        }

        const env = { cacheStore: this.cacheStore, replaceOrders: [] }
        this.rendered = md.render(after.content, env)

        if (env.replaceOrders.length === 0) {
          return
        }

        const replacer = (isCreated || isDocunemtChange) ? this.replace : this.debounceReplace
        replacer(env.replaceOrders)
      },
      immediate: true
    }
  },
  methods: {
    debounceReplace: debounce(function (this: any, orders: Array<LazyReplaceOrder>) {
      this.replace(orders)
    }, 1000, { leading: false, trailing: true }),
    replace (orders: Array<LazyReplaceOrder>) {
      let result = this.rendered
      orders.forEach(order => {
        result = lazyReplacer(result, order, this.cacheStore)
      })
      this.rendered = result
    }
  }
})
</script>

<style lang="stylus" scoped>
@import '~github-markdown-css/github-markdown.css'
</style>
