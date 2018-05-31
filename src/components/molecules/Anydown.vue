<template lang="pug">
renderer.markdown-body(:value="value", @input="$emit('input', $event)")
</template>

<script lang="ts">
import Vue from 'vue'
import { Installer as RendererInstaller } from '@/anydown'
import PlantUMLComponent from '@/components/atoms/AnydownPlantUML.vue'
import TestComponent from '@/components/atoms/AnydownTest.vue'
import PrettyCodeComponent from '@/components/atoms/AnydownPrettyCode.vue'
import { ListItem, Paragraph } from 'mdast'

const renderer = new RendererInstaller()
  .addAnydownComponent('uml', PlantUMLComponent)
  .addAnydownComponent('test', TestComponent)
  .addAnydownComponent(() => true, PrettyCodeComponent)
  .addCustomHandler('listItem', (node: ListItem, { parent, h, onInput, handleChildren }) => {
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

    const oldest = node.children[0]
    const isP = (n: any): n is Paragraph => n && n.type === 'paragraph'
    if (node.children.length === 1 && isP(oldest)) {
      // TextNodeだけにする
      node.children.splice(0, 1, oldest.children[0])
    } else {
      // TODO: 全体をParagraphで囲む
    }

    const children = handleChildren(node.children)
    const li = h('li', { class: 'task-list-item' }, [checkbox, ' ', ...children])

    return parent.position!.start.column > 1 ? h('ul', [li]) : li
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
