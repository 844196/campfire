/* eslint-disable indent */
/* eslint-disable space-infix-ops */
/* eslint-disable no-use-before-define */

import { Element as HNodeElement, TextNode as HNodeText } from 'hast'
import { Root as MNodeRoot } from 'mdast'
import { Options as toHASTOptions } from 'mdast-util-to-hast'
import { Node as UNode } from 'unist'
import { CreateElement, VNode } from 'vue'

// ノードの再定義
export type MNode = UNode
export type HNode = HNodeElement | HNodeText

// UNodeを継承したノードのタイプを取得するヘルパー型
export type NodeType<T extends UNode> = T['type'] & string

// Markdown文字列をMNodeへ変換する
export type Parser = (src: string) => MNodeRoot

// HNodeタイプに対応したハンドラのマップ
export type BundledHandlers = Required<toHASTOptions>['handlers']

// パーサーで変換されたMNodeを受け取りVNodeへ変換する
export type Compiler = (
  mnodeRoot: MNodeRoot,
  h: CreateElement,
  onInput: InputEventDispatcher
) => VNode

// 任意のタイプのMNodeをVNodeへ変換する
// VNodeを返さなかった場合は、デフォルトのハンドラが呼び出される
export type CustomHandler<T extends MNode> = (
  node: T,
  payload: CustomHandlerPayload
) => VNode | void
export type CustomHandlerPayload = CustomHandlerPayloadContext & CustomHandlerPayloadHelpers
export type CustomHandlerPayloadContext = {
  parent: MNode
}
export type CustomHandlerPayloadHelpers = {
  h: CreateElement,
  onInput: InputEventDispatcher,
  handleChildren: (children: Array<MNode>) => Array<VNode>
}

// リフレクターを受け取りinputイベントを発火させる
export type InputEventDispatcher = (reflect: Reflector) => void

// 変換元となったMarkdown文字列全体を受け取り、変更を反映した文字列を返す
export type Reflector = (src: string) => string
