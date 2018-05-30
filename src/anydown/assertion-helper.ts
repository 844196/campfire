import {
  VNode,
  HNodeText,
  HNodeElement,
  MNodeCode
} from './types'

export function isVNode (node: any): node is VNode {
  return node.isRootInsert !== undefined
}

export function isHNodeText (node: any): node is HNodeText {
  return node.type === 'text'
}

export function isHNodeElement (node: any): node is HNodeElement {
  return node.type === 'element'
}

export function isMNodeCode (node: any): node is MNodeCode {
  return node.type === 'code'
}
