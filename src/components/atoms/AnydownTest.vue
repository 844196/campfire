<template lang="pug">
input(:value="value", @input="onInput($event.target.value)")
</template>

<script lang="ts">
import Vue from 'vue'
import customFence from '@/utils/markdown-it-custom-fence'

export const ComponentName = 'test'

export const MarkdownItPlugin = customFence({
  lang: ['foo', 'bar'],
  render: (tokens, idx) => {
    console.log(tokens[idx])
    return `<${ComponentName} :value='${JSON.stringify(tokens[idx].content)}' @input="onInput" />`
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
