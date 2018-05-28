import {
  Element as HNodeElement,
  ElementProperties as HNodeElementProperties,
  TextNode as HNodeText
} from 'hast'
import h from 'hastscript'
import { reduce } from 'lodash'
import { Root as MNodeRoot } from 'mdast'
import toHNode from 'mdast-util-to-hast'
import defaultHNodeHandlers from 'mdast-util-to-hast/lib/handlers'
import {
  VNode,
  VNodeData,
  CreateElement as VNodeFactory
} from 'vue'
import {
  isHNodeElement,
  isHNodeText,
  isVNode
} from './assertion-helper'
import CustomHandlerSet from './custom-handler'
import { InputHandler } from './renderer'

type HNode = HNodeElement | HNodeText

function toVNodeProps (from: HNodeElementProperties) {
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

function toVNode (v: VNodeFactory, node: VNode | HNode, children: Array<VNode | HNode>): VNode | string {
  if (isVNode(node)) {
    return node
  }

  if (isHNodeText(node)) {
    return node.value
  }

  return v(
    node.tagName,
    toVNodeProps(node.properties),
    children.map(c => toVNode(v, c, isHNodeElement(c) ? c.children as Array<VNode | HNode> : []))
  )
}

export default function install (customHandlers: CustomHandlerSet) {
  return function (mnodeRoot: MNodeRoot, v: VNodeFactory, inputHandler: InputHandler) {
    const hnode = toHNode(mnodeRoot, {
      handlers: customHandlers.bundle(v, inputHandler, defaultHNodeHandlers)
    })
    return toVNode(v, h('div'), hnode.children as Array<VNode | HNode>) as VNode
  }
}
