import 'github-markdown-css/github-markdown.css'

import { debounce } from 'lodash'
import MarkdownIt from 'markdown-it'
import Vue, { CreateElement } from 'vue'
import UUID from '@/utils/uuid'
import markdownitPlantUML, {
  CachePlantUMLPool,
  PlantUMLRendererEnv,
  PlantUMLReplaceOrder
} from './markdown-it-plantuml'

const md = new MarkdownIt()
const cachePool: CachePlantUMLPool = new Map<string, string>()
md.use(markdownitPlantUML, cachePool)

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
