<script lang="ts">
import Vue, { VNode } from 'vue'
import { VueConstructor } from 'vue/types/vue'
import { ComponentOptions } from 'vue/types/options'
import VueWithCompiler from 'vue/dist/vue.esm'
import MarkdownIt from 'markdown-it'
import MarkdownItSrc, { RenderEnv as MarkdownRenderEnv } from '@/utils/markdown-it-src'

export { MarkdownRenderEnv }

export type AnydownComponent = {
  ComponentName: string
  Component: any
  MarkdownItPlugin: Function
}

export type InstallerParams = {
  md?: MarkdownIt.MarkdownIt
  components?: Array<AnydownComponent>
}

// eslint-disable-next-line
export function Install (params: InstallerParams = {}): VueConstructor {
  const md = params.md || new MarkdownIt()

  md.use(MarkdownItSrc)

  // eslint-disable-next-line
  let components: ComponentOptions<Vue>['components'] = {}
  for (const c of (params.components || [])) {
    components[c.ComponentName] = c.Component
    md.use(c.MarkdownItPlugin)
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
          const template = `<div>${md.render(this.value)}</div>`
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
      onInput (v: any) {
        console.log(v)
      }
    }
  })
}

export default Install()
</script>
