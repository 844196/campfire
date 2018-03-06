<template lang="pug">
.previewer.markdown-body(v-html="rendered")
</template>

<script>
import Vue from 'vue'
import UMLEncoder from 'plantuml-encoder'
import MarkdownIt from 'markdown-it'
import JsSHA from 'jssha'
import throttle from 'throttle-debounce/throttle'

const cacheStore = {
  container: new Map(),
  get (category, cacheId) {
    if (!this.container.has(category)) {
      return undefined
    }
    return this.container.get(category).get(cacheId)
  },
  set (category, cacheId, value) {
    if (!this.container.has(category)) {
      this.container.set(category, new Map())
    }
    this.container.get(category).set(cacheId, value)
  },
  del (category, cacheId) {
    if (!this.container.has(category)) {
      return
    }
    this.container.get(category).delete(cacheId)
  }
}

const sha256 = (text) => {
  const s = new JsSHA('SHA-256', 'TEXT')
  s.update(text)
  return s.getHash('HEX')
}

const md = new MarkdownIt()

const originRenderer = md.renderer.rules.fence
const umlRenderer = (tokens, idx, options, env, slf) => {
  const fenceIdx = tokens
    .reduce((acc, t, i) => {
      if (t.type === 'fence') acc.push(parseInt(i))
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

  env.replaceOrders.push({ fenceIdx, currentHash, decodedUrl, replaceFrom, replaceTo })

  return replaceFrom
}

md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
  const lang = tokens[idx].info.trim().split(/\s+/g)[0]
  const renderer = (lang === 'uml' || lang === 'plantuml') ? umlRenderer : originRenderer
  return renderer(tokens, idx, options, env, slf)
}

export default Vue.extend({
  name: 'Previewer',
  props: {
    value: {
      type: String | InputEvent,
      required: true
    }
  },
  data () {
    return {
      rendered: '',
      cacheStore
    }
  },
  watch: {
    value (value) {
      let env = { replaceOrders: [] }
      this.rendered = md.render(value, env)
      env.replaceOrders.forEach(this.replace, this)
    }
  },
  methods: {
    replace: throttle(500, function (order) {
      this.rendered = this.rendered.replace(order.replaceFrom, order.replaceTo)
      this.cacheStore.set('fence', order.fenceIdx, { hash: order.currentHash, decodedUrl: order.decodedUrl })
    }, false)
  }
})
</script>

<style lang="stylus" scoped>
@import '~github-markdown-css/github-markdown.css'
</style>
