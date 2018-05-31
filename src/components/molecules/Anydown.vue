<template lang="pug">
renderer.markdown-body(:value="value", @input="$emit('input', $event)")
</template>

<script lang="ts">
import Vue from 'vue'
import { Installer as RendererInstaller } from '@/anydown'
import PlantUMLComponent from '@/components/atoms/AnydownPlantUML.vue'
import TestComponent from '@/components/atoms/AnydownTest.vue'
import { ListItem } from 'mdast'

const renderer = new RendererInstaller()
  .addAnydownComponent('uml', PlantUMLComponent)
  .addAnydownComponent('test', TestComponent)
  .addCustomHandler('listItem', (node: ListItem, { parent, h, onInput, handleChildren }) => {
    if (node.checked === null) {
      return
    }

    const toggleCheckbox = (src: string) => {
      let splited = src.split('\n')
      const pos = node.position!.start.line - 1
      const before = splited[pos]
      if (node.checked) {
        splited[pos] = before.replace(/\[x\]/, '[ ]')
      } else {
        splited[pos] = before.replace(/\[ \]/, '[x]')
      }
      return splited.join('\n')
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
