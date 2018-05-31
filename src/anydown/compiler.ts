import { Element as HNodeElement, TextNode as HNodeText } from 'hast'
import hast from 'hastscript'
import { flattenDepth, reduce } from 'lodash'
import { Root as MNodeRoot } from 'mdast'
import toHNode from 'mdast-util-to-hast'
import { CreateElement, VNode, VNodeData } from 'vue'
import { isHNodeElement, isHNodeText, isVNode } from './assertion-helper'
import CustomHandlerSet from './custom-handler'
import { BundledHandlers, HNode, InputEventDispatcher, MNode } from './types'

function toVNodeData (node: HNodeElement) {
  const from = node.properties
  return reduce(from, (acc, value, key) => {
    if (key === 'className') {
      acc['class'] = value
      return acc
    }
    if (!acc.attrs) {
      acc['attrs'] = {}
    }
    acc.attrs![key] = value
    return acc
  }, {} as VNodeData)
}

function toVNode (h: CreateElement, node: HNodeText, children: Array<VNode | HNode>): string
function toVNode (h: CreateElement, node: VNode | HNodeElement, children: Array<VNode | HNode>): VNode
function toVNode (h: CreateElement, node: VNode | HNode, children: Array<VNode | HNode>) {
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

function toVHNode (mnode: MNode, handlers: BundledHandlers) {
  const result = toHNode(mnode, { handlers })
  return result as typeof result & { children: Array<VNode | HNode> }
}

export default function install (customHandlers: CustomHandlerSet) {
  return function (mnode: MNodeRoot, h: CreateElement, onInput: InputEventDispatcher) {
    const handlers = customHandlers.bundle({
      h,
      onInput,
      handleChildren (children) {
        const vhnodes = flattenDepth(children.map(c => toVHNode(c, handlers)).map(c => c.children), 1)
        return toVNode(h, hast('div'), vhnodes).children || []
      }
    })
    return toVNode(h, hast('div'), toVHNode(mnode, handlers).children)
  }
}
