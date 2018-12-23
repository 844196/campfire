import { ListItem, Paragraph, TextNode } from 'mdast'
import { CompilerBuilder, customCodeblock, installRenderer } from '@/anydown'
import PlantUMLComponent from './AnydownPlantUML.vue'
import PrettyCodeComponent from './AnydownPrettyCode.vue'
import TestComponent from './AnydownTest.vue'

const compilerBuilder = new CompilerBuilder()
  .use(customCodeblock('test', TestComponent))
  .use(customCodeblock(['plantuml', 'uml'], PlantUMLComponent))
  .use(customCodeblock(() => true, PrettyCodeComponent))

compilerBuilder.use<ListItem>('listItem', ({ h, commit, wrap }, node) => {
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
      change: () => commit(toggleCheckbox)
    }
  })

  let container = [checkbox, ...node.children]

  const firstChild = node.children[0]
  const isParagraph = (node: any): node is Paragraph => node && node.type === 'paragraph'
  if (isParagraph(firstChild)) {
    const margin: TextNode = { type: 'text', value: ' ' }
    firstChild.children.unshift(margin)

    const labelWrapped = h(
      'label',
      { style: { cursor: 'pointer' } },
      wrap([checkbox, ...firstChild.children])
    )
    container = node.children.length > 1
      ? [h('p', [labelWrapped]), ...node.children.slice(1)]
      : [labelWrapped]
  }

  return h('li', { class: 'task-list-item' }, wrap(container))
})

export default installRenderer(compilerBuilder.build())
