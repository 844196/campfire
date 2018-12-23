/* eslint-disable import/export */

import { Element as HNodeElement, TextNode as HNodeText } from 'hast'
import reduce from 'lodash/reduce'
import { CreateElement, VNode, VNodeData } from 'vue'
import { isHNodeElement, isHNodeText, isVNode } from './node-type-guards'

function toVNodeData (node: HNodeElement) {
  return reduce(node.properties, (acc, value, key) => {
    if (key === 'className') {
      acc['class'] = value
      return acc
    }
    if (!acc.attrs) {
      acc.attrs = {}
    }
    acc.attrs[key] = value
    return acc
  }, {} as VNodeData)
}

export function toVNode (h: CreateElement, node: VNode, children: Array<VNode | HNodeElement | HNodeText>): VNode
export function toVNode (h: CreateElement, node: HNodeElement, children: Array<VNode | HNodeElement | HNodeText>): VNode
export function toVNode (h: CreateElement, node: HNodeText, children: Array<VNode | HNodeElement | HNodeText>): string
export function toVNode (h: CreateElement, node: VNode | HNodeElement | HNodeText, children: Array<VNode | HNodeElement | HNodeText>) {
  if (isVNode(node)) {
    return node
  }
  if (isHNodeText(node)) {
    return node.value
  }
  return h(
    node.tagName,
    toVNodeData(node),
    children.map<VNode | string>(n => toVNode(h, n as any, isHNodeElement(n) ? n.children as any : []))
  )
}
