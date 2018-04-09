<template lang="pug">
.previewer.markdown-body(v-html="rendered")
</template>

<script lang="ts">
import Vue from 'vue'
import UMLEncoder from 'plantuml-encoder'
import MarkdownIt, { Token, TokenRender } from 'markdown-it'
import { sha256 } from '@/utils/hash'
import { LooseMap2 } from '@/utils/map'
import { throttle } from 'throttle-debounce'
import UUID from '@/utils/uuid'

type Cache = {
  hash: string
  decodedUrl: string
}
type ReplaceParameter = {
  fenceIdx: number
  currentHash: string
  decodedUrl: string
  replaceFrom: string
  replaceTo: string
}
type RendererEnv = {
  cacheStore: LooseMap2<Cache>
  replaceOrders: Array<ReplaceParameter>
}

const md = new MarkdownIt()

const originRenderer = md.renderer.rules.fence
// eslint-disable-next-line space-infix-ops
const umlRenderer: TokenRender = (tokens, idx, _, { cacheStore, replaceOrders }: RendererEnv, __) => {
  const fenceIdx = tokens
    .reduce((acc: number[], t: Token, idx: number) => {
      if (t.type === 'fence') acc.push(idx)
      return acc
    }, [])
    .findIndex(i => i === idx)
  const content = tokens[idx].content

  if (content.replace('\n', '') === '') {
    cacheStore.del('fence', fenceIdx)
    return ''
  }

  const currentHash = sha256(content)
  const cached = cacheStore.get('fence', fenceIdx)
  if (cached && currentHash === cached.hash) {
    // 2回目以降 && 変更なし
    return `<img src="${cached.decodedUrl}">`
  }

  // 1回目 || 2回目以降変更あり
  const decodedUrl = `http://www.plantuml.com/plantuml/svg/${UMLEncoder.encode(content)}`
  const replaceFrom = cached
    ? `<img src="${cached.decodedUrl}" data-new-hash="${currentHash}">`
    : `<span data-new-hash="${currentHash}"></span>`
  const replaceTo = `<img src="${decodedUrl}">`

  replaceOrders.push({ fenceIdx, currentHash, decodedUrl, replaceFrom, replaceTo })

  return replaceFrom
}

md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
  const lang = tokens[idx].info.trim().split(/\s+/g)[0]
  const renderer = (lang === 'uml' || lang === 'plantuml') ? umlRenderer : originRenderer
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
      cacheStore: new LooseMap2<Cache>()
    }
  },
  watch: {
    value: {
      handler (after: MarkdownDocument, before?: MarkdownDocument) {
        const isCreated = !before
        const isDocunemtChange = before && !before.uuid.isEqual(after.uuid)

        if (isDocunemtChange) {
          this.cacheStore.delAll()
        }

        // eslint-disable-next-line space-infix-ops
        const env: RendererEnv = { cacheStore: this.cacheStore, replaceOrders: [] }
        this.rendered = md.render(after.content, env)

        const replacer = (isCreated || isDocunemtChange) ? this.replace : this.throttleReplace
        env.replaceOrders.forEach(replacer, this)
      },
      immediate: true
    }
  },
  methods: {
    throttleReplace: throttle(500, function (this: any, param: ReplaceParameter) {
      this.replace(param)
    }, false),
    replace (param: ReplaceParameter) {
      this.rendered = this.rendered.replace(param.replaceFrom, param.replaceTo)
      this.cacheStore.set('fence', param.fenceIdx, { hash: param.currentHash, decodedUrl: param.decodedUrl })
    }
  }
})
</script>

<style lang="stylus" scoped>
@import '~github-markdown-css/github-markdown.css'
</style>
