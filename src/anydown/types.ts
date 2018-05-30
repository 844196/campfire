/* eslint-disable indent */
/* eslint-disable space-infix-ops */

import {
  Element as HNodeElement,
  ElementProperties as HNodeElementProperties,
  TextNode as HNodeText
} from 'hast'
import {
  Code as MNodeCode,
  Root as MNodeRoot
} from 'mdast'
import { Options as toHASTOptions } from 'mdast-util-to-hast'
import { Node as MNode } from 'unist'
import {
  CreateElement,
  VNode,
  VNodeData
} from 'vue'

export type VNodeFactory = CreateElement
export type HNode = HNodeElement | HNodeText
export type VHNode = VNode | HNode
export {
  MNode,
  VNode,
  MNodeRoot,
  VNodeData,
  HNodeElementProperties,
  MNodeCode,
  HNodeText,
  HNodeElement
}

export type InputHandler = (reflect: Reflector) => void
export type Parser = (src: string) => MNodeRoot
export type Compiler = (mnodeRoot: MNodeRoot, h: VNodeFactory, onInput: InputHandler) => VNode
export type Reflector = (src: string) => string
export type ChildrenConverter = (children: Array<MNode>) => Array<VNode>

export type CustomHandler<T = MNode> = (
  node: T,
  parent: MNode,
  utils: {
    h: VNodeFactory,
    onInput: InputHandler,
    convertChildren: ChildrenConverter
  }
) => VNode | void
export type BundledHandlers = Required<toHASTOptions>['handlers']

export type MNodeType<T extends MNode> = T['type'] & string
