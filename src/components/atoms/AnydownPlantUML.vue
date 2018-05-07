<template lang="pug">
component(:is="tag", :src="src")
</template>

<script lang="ts">
import Vue from 'vue'
import PlantUML from 'plantuml-encoder'
import { debounce } from 'lodash'
import customFence from '@/utils/markdown-it-custom-fence'

export const ComponentName = 'debounce-img'

export const MarkdownItPlugin = customFence({
  lang: ['uml', 'plantuml'],
  render (tokens, idx) {
    const encoded = PlantUML.encode(tokens[idx].content)
    return `<${ComponentName} value="http://www.plantuml.com/plantuml/svg/${encoded}" />`
  }
})

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
