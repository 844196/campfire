<template lang="pug">
component(:is="tag", :src="src")
</template>

<script lang="ts">
import Vue from 'vue'
// eslint-disable-next-line
import MarkdownIt, { TokenRender, Token } from 'markdown-it'
import PlantUMLEncoder from 'plantuml-encoder'
import { debounce } from 'lodash'

export const ComponentName = 'debounce-img'

export function MarkdownItPlugin (md: MarkdownIt.MarkdownIt) {
  const originRenderer = md.renderer.rules.fence

  const isPlantUMLFence = function (token: Token) {
    const lang = token.info.trim().split(/\s+/g)[0]
    return (lang === 'plantuml') || (lang === 'uml')
  }

  // eslint-disable-next-line
  const plantUMLRenderer: TokenRender = function (tokens, index) {
    const content = tokens[index].content
    const encoded = PlantUMLEncoder.encode(content)
    return `<${ComponentName} value="http://www.plantuml.com/plantuml/svg/${encoded}" />`
  }

  md.renderer.rules.fence = function (tokens, index, options, env, self) {
    const renderer = isPlantUMLFence(tokens[index]) ? plantUMLRenderer : originRenderer
    return renderer(tokens, index, options, env, self)
  }
}

export const Component = Vue.extend({
  name: ComponentName,
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      tag: 'span',
      src: ''
    }
  },
  watch: {
    value: {
      handler: debounce(function (this: any) {
        this.tag = 'img'
        this.src = this.value
      }, 1000, { leading: false, trailing: true }),
      immediate: true
    }
  }
})

export default Component
</script>
