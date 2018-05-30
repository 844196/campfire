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

export type CustomHandler = (
  node: MNode,
  h: VNodeFactory,
  inputHandler: InputHandler,
  bundledHandlers: BundledHandlers
) => VNode | void
export type BundledHandlers = Required<toHASTOptions>['handlers']
