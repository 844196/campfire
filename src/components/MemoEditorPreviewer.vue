<template lang="pug">
.markdown-body(v-html="rendered")
</template>

<script lang="ts">
import 'github-markdown-css/github-markdown.css'
import { debounce } from 'lodash'
import MarkdownIt from 'markdown-it'
import Vue from 'vue'
import UUID from '@/utils/uuid'
// eslint-disable-next-line space-infix-ops
import markdownitPlantUML, {
  CachePlantUMLPool,
  PlantUMLRendererEnv,
  PlantUMLReplaceOrder
} from '@/utils/markdown-it-plantuml'

const md = new MarkdownIt()
const cachePool: CachePlantUMLPool = new Map<string, string>()
md.use(markdownitPlantUML, cachePool)

export interface MarkdownDocument {
  content: string
  uuid: UUID
}

export default Vue.extend({
  name: 'MemoEditorPreviewer',
  props: {
    value: {
      type: Object as () => MarkdownDocument,
      required: true
    }
  },
  data () {
    return {
      rendered: '',
      cachePool
    }
  },
  watch: {
    value: {
      handler (after: MarkdownDocument, before?: MarkdownDocument) {
        const isComponentCreated = !before
        const isDocumentChanged = before && !before.uuid.isEqual(after.uuid)
        const isContentChanged = after.content !== (before ? before.content : '')

        if (isDocumentChanged) {
          this.cachePool.clear()
        }

        if (!isContentChanged) {
          return
        }

        // eslint-disable-next-line space-infix-ops
        const env: PlantUMLRendererEnv = {
          processedPlantUMLs: new Map(),
          plantUMLReplaceOrders: []
        }
        this.rendered = md.render(after.content, env)

        this.cachePool.forEach((_, hash) => {
          if (!env.processedPlantUMLs.has(hash)) {
            this.cachePool.delete(hash)
          }
        })

        if (env.plantUMLReplaceOrders.length === 0) {
          return
        }

        const replacer = (isComponentCreated || isDocumentChanged) ? this.replace : this.debounceReplace
        replacer(env.plantUMLReplaceOrders)
      },
      immediate: true
    }
  },
  methods: {
    replace (orders: Array<PlantUMLReplaceOrder>) {
      orders.forEach(order => {
        this.rendered = this.rendered.replace(order.replaceFrom, order.replaceTo)
      })
    },
    debounceReplace: debounce(function (this: any, orders: Array<PlantUMLReplaceOrder>) {
      this.replace(orders)
    }, 1000, { leading: false, trailing: true })
  }
})
</script>
