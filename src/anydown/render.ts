import Vue, { VNode } from 'vue'
import { VueConstructor } from 'vue/types/vue'
import { ComponentOptions } from 'vue/types/options'
import VueWithCompiler from 'vue/dist/vue.esm'
import { v4 as isUUID } from 'is-uuid'
import MarkdownIt from 'markdown-it'
import transformer from './transformer'
import reflect from './reflector'
import Hashids from 'hashids'

const hashids = new Hashids('', 16, 'abcdefghijklmnopqrstuvwxyz')

export type AnydownRule = {
  lang: string
  component: any
}

export default function install (md: MarkdownIt.MarkdownIt, rules?: Array<AnydownRule>): VueConstructor {
  let components: ComponentOptions<Vue>['components'] = {}
  for (const [idx, { lang, component }] of (rules || []).entries()) {
    const name = hashids.encode(idx)
    components[name] = component
    md.use(transformer, { lang, eleName: name })
  }

  return Vue.extend({
    name: 'AnydownRender',
    components,
    props: {
      uuid: {
        type: String,
        required: true,
        validator: (given: string) => isUUID(given)
      },
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

          // @ts-ignore: 非公開プロパティ
          this._staticTrees = []

          this.$options.staticRenderFns = []
          for (const fn of compiled.staticRenderFns) {
            this.$options.staticRenderFns.push(fn)
          }
        },
        immediate: true
      },
      uuid () {
        // @ts-ignore: 非公開プロパティ
        this._vnode = null

        this.$forceUpdate()
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
