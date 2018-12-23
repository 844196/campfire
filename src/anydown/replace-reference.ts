import { Image, ImageReference, Link, LinkReference, Root, TextNode } from 'mdast'
import definitions from 'mdast-util-definitions'
import visit from 'unist-util-visit'

function txt (value: string): TextNode {
  return { type: 'text', value }
}

function identifier (node: LinkReference | ImageReference): TextNode {
  switch (node.referenceType) {
    case 'full':
      return txt(`[${node.identifier}]`)
    case 'collapsed':
      return txt('[]')
    default:
      return txt('')
  }
}

export function replaceReference (root: Root): Root {
  const findDefinition = definitions(root)

  visit<LinkReference>(root, 'linkReference', (node, idx, parent) => {
    const def = findDefinition(node.identifier)

    if (def) {
      parent!.children[idx!] = {
        type: 'link',
        url: def.url,
        title: def.title,
        position: node.position,
        children: node.children
      } as Link
      return 'skip'
    }

    const alt = [txt('['), ...node.children, txt(']'), identifier(node)]
    parent!.children.splice(idx!, node.children.length, ...alt)
    return 'skip'
  })

  visit<ImageReference>(root, 'imageReference', (node, idx, parent) => {
    const def = findDefinition(node.identifier)

    if (def) {
      parent!.children[idx!] = {
        type: 'image',
        url: def.url,
        title: def.title,
        alt: node.alt,
        position: node.position
      } as Image
      return 'skip'
    }

    const alt = [
      txt(`![${node.referenceType === 'full' ? (node.alt || '') : node.identifier}]`),
      identifier(node)
    ]
    parent!.children.splice(idx!, alt.length, ...alt)
    return 'skip'
  })

  return root
}
