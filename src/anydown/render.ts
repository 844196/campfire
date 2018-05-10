import Vue, { VNode } from 'vue'
import { VueConstructor } from 'vue/types/vue'
import { ComponentOptions } from 'vue/types/options'
import VueWithCompiler from 'vue/dist/vue.esm'
import transformer from './transformer'
import MarkdownIt from 'markdown-it'
import reflect from './reflector'

export type AnydownRule = {
  lang: string
  component: any
}

export default function install (rules?: Array<AnydownRule>): VueConstructor {
  const md = new MarkdownIt()

  let components: ComponentOptions<Vue>['components'] = {}
  for (const r of (rules || [])) {
    const C = Vue.extend(r.component)
    const c = new C({ propsData: { value: '' } })
    const cName = c.$options.name!
    c.$destroy()

    components[cName] = r.component
    md.use(transformer, { lang: r.lang, eleName: cName })
  }

  return Vue.extend({
    name: 'AnydownRender',
    components,
    props: {
      value: {
        type: String,
        required: true
      }
    },
    data (): { templateRender: Function | null } {
      return {
        templateRender: null
      }
    },
    watch: {
      value: {
        handler () {
          const html = md.render(this.value)
          const template = `<div>${html}</div>`

          const compiled = VueWithCompiler.compile(template)
          this.templateRender = compiled.render

          // @ts-ignore
          // reason: 非公開プロパティを直接操作
          this._staticTrees = []

          this.$options.staticRenderFns = []
          for (const fn of compiled.staticRenderFns) {
            this.$options.staticRenderFns.push(fn)
          }
        },
        immediate: true
      }
    },
    render (h): VNode {
      return this.templateRender ? this.templateRender() : h('div')
    },
    methods: {
      onInput (value: string, position: [number, number]) {
        this.$emit('input', reflect(this.value, value, position))
      }
    }
  })
}
