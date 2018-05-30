import h from 'hastscript'
import { flattenDepth, reduce } from 'lodash'
import toHNode from 'mdast-util-to-hast'
import defaultHNodeHandlers from 'mdast-util-to-hast/lib/handlers'
import {
  isHNodeElement,
  isHNodeText,
  isVNode
} from './assertion-helper'
import CustomHandlerSet from './custom-handler'
import {
  BundledHandlers,
  ChildrenConverter,
  HNodeElement,
  HNodeText,
  InputHandler,
  MNode,
  MNodeRoot,
  VNode,
  VNodeData,
  VNodeFactory
} from './types'

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

function toVNode (vnodeFactory: VNodeFactory, node: HNodeText, children: Array<VNode | HNodeElement | HNodeText>): string
function toVNode (vnodeFactory: VNodeFactory, node: HNodeElement, children: Array<VNode | HNodeElement | HNodeText>): VNode
function toVNode (vnodeFactory: VNodeFactory, node: VNode, children: Array<VNode | HNodeElement | HNodeText>): VNode
function toVNode (vnodeFactory: VNodeFactory, node: VNode | HNodeText | HNodeElement, children: Array<VNode | HNodeElement | HNodeText>) {
  if (isVNode(node)) {
    return node
  }

  if (isHNodeText(node)) {
    return node.value
  }

  return vnodeFactory(
    node.tagName,
    toVNodeData(node),
    children.map<VNode | string>(n => toVNode(vnodeFactory, n as any, isHNodeElement(n) ? n.children as any : []))
  )
}

function toVHNode (mnode: MNode, handlers: BundledHandlers) {
  const result = toHNode(mnode, { handlers })
  return result as typeof result & { children: Array<VNode | HNodeElement | HNodeText> }
}

export default function install (customHandlers: CustomHandlerSet) {
  return function (mnode: MNodeRoot, vnodeFactory: VNodeFactory, inputHandler: InputHandler) {
    let handlers: BundledHandlers
    const childrenConverter: ChildrenConverter = (children) => {
      const vhnodes = flattenDepth(children.map(c => toVHNode(c, handlers)).map(c => c.children), 1)
      return toVNode(vnodeFactory, h('div'), vhnodes).children || []
    }
    handlers = customHandlers.bundle(vnodeFactory, inputHandler, childrenConverter, defaultHNodeHandlers)

    return toVNode(vnodeFactory, h('div'), toVHNode(mnode, handlers).children)
  }
}
