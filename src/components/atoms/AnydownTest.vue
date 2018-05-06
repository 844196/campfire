<template lang="pug">
input(:value="value", @input="onInput($event.target.value)")
</template>

<script lang="ts">
import Vue from 'vue'
import MarkdownIt from 'markdown-it'

export const ComponentName = 'test'

export function MarkdownItPlugin (md: MarkdownIt.MarkdownIt) {
  const originRenderer = md.renderer.rules.fence

  md.renderer.rules.fence = function (tokens, index, options, env, self) {
    const token = tokens[index]

    const lang = token.info.trim().split(/\s+/g)[0]
    if (lang !== 'test') {
      return originRenderer(tokens, index, options, env, self)
    }

    return `<${ComponentName} :value='${JSON.stringify(token.content)}' @input="onInput"/>`
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
  methods: {
    onInput (v: string) {
      this.$emit('input', {
        name: ComponentName,
        value: v
      })
    }
  }
})

export default Component
</script>
