<template lang="pug">
renderer.markdown-body(:value="value", @input="$emit('input', $event)")
</template>

<script lang="ts">
import Vue from 'vue'
import { Installer as RendererInstaller } from '@/anydown'
import PlantUMLComponent from './AnydownPlantUML.vue'
import TestComponent from './AnydownTest.vue'
import PrettyCodeComponent from './AnydownPrettyCode.vue'
import { ListItem, Paragraph, TextNode } from 'mdast'

const renderer = new RendererInstaller()
  .addAnydownComponent(['plantuml', 'uml'], PlantUMLComponent)
  .addAnydownComponent('test', TestComponent)
  .addAnydownComponent(() => true, PrettyCodeComponent)
  .addCustomHandler('listItem', (node: ListItem, { h, onInput, handleChildren }) => {
    if (node.checked === null) {
      return
    }

    const toggleCheckbox = (src: string) => {
      let lines = src.split('\n')
      const idx = node.position!.start.line - 1
      lines[idx] = lines[idx].replace(/\[[ x]\]/, node.checked ? '[ ]' : '[x]')
      return lines.join('\n')
    }
    const checkbox = h('input', {
      attrs: {
        type: 'checkbox',
        checked: node.checked
      },
      on: {
        change: () => onInput(toggleCheckbox)
      }
    })

    const firstChild = node.children[0]
    let container = [checkbox, ...node.children]
    const isParagraph = (node: any): node is Paragraph => node && node.type === 'paragraph'
    if (isParagraph(firstChild)) {
      const margin = { type: 'text', value: ' ' } as TextNode
      firstChild.children.unshift(margin)

      if (node.children.length > 1) {
        container = [
          h('p', handleChildren([checkbox, ...firstChild.children])),
          ...node.children.slice(1)
        ]
      } else {
        container = [checkbox, ...firstChild.children]
      }
    }

    return h('li', { class: 'task-list-item' }, handleChildren(container))
  })
  .install()

export default Vue.extend({
  name: 'Anydown',
  components: {
    renderer
  },
  props: {
    value: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="stylus">
.markdown-body li>p
  margin-top: unset !important
  margin-bottom: .25em
</style>

<style src="github-markdown-css/github-markdown.css">
