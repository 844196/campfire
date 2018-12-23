import { Element as HNodeElement, TextNode as HNodeText } from 'hast'
import { VNode } from 'vue'

export function isVNode (node: any): node is VNode {
  return node && node.isRootInsert !== undefined
}

export function isHNodeText (node: any): node is HNodeText {
  return node && node.type === 'text'
}

export function isHNodeElement (node: any): node is HNodeElement {
  return node && node.type === 'element'
}
