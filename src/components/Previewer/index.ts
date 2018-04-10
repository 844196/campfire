import 'github-markdown-css/github-markdown.css'

import { debounce } from 'lodash'
import MarkdownIt from 'markdown-it'
import Vue, { CreateElement } from 'vue'
import { LooseMap2 } from '@/utils/map'
import UUID from '@/utils/uuid'
import { LazyReplaceOrder, lazyReplacer } from './lazy-replacer'
import { LazyResourceCache } from './lazy-resource'
import { isUMLFence, umlRenderer } from './renderer'

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
      cacheStore: new LooseMap2<LazyResourceCache>()
    }
  },
  watch: {
    value: {
      handler (after: MarkdownDocument, before?: MarkdownDocument) {
        const isComponentCreated = !before
        const isDocumentChanged = before && !before.uuid.isEqual(after.uuid)
        const isContentChanged = after.content !== (before ? before.content : '')

        if (isDocumentChanged) {
          this.cacheStore.delAll()
        }

        if (!isContentChanged) {
          return
        }

        const env = { cacheStore: this.cacheStore, replaceOrders: [] }
        this.rendered = md.render(after.content, env)

        if (env.replaceOrders.length === 0) {
          return
        }

        const replacer = (isComponentCreated || isDocumentChanged) ? this.replace : this.debounceReplace
        replacer(env.replaceOrders)
      },
      immediate: true
    }
  },
  methods: {
    replace (orders: Array<LazyReplaceOrder>) {
      orders.forEach(order => {
        this.rendered = lazyReplacer(this.rendered, order, this.cacheStore)
      })
    },
    debounceReplace: debounce(function (this: any, orders: Array<LazyReplaceOrder>) {
      this.replace(orders)
    }, 1000, { leading: false, trailing: true })
  },
  render (createElement: CreateElement) {
    return createElement('div', {
      class: [
        'markdown-body'
      ],
      domProps: {
        innerHTML: this.$data.rendered // workaround
      }
    })
  }
})
