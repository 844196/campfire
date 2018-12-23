/* eslint-disable indent */
/* eslint-disable space-infix-ops */
/* eslint-disable no-use-before-define */

import { Root as MNodeRoot } from 'mdast'
import { Node as UNode, Parent } from 'unist'
import { CreateElement, VNode } from 'vue'

// ノードの再定義
export type MNode = UNode

// UNodeを継承したノードのタイプを取得するヘルパー型
export type NodeType<T extends UNode> = T['type'] & string

// パーサーで変換されたMNodeを受け取りVNodeへ変換する
export interface Compiler {
  compile (node: MNodeRoot, h: CreateElement, commit: MutationCommitter): VNode
}

// 任意のタイプのMNodeをVNodeへ変換する
// VNodeを返さなかった場合は、デフォルトのハンドラが呼び出される
export interface Middleware<T extends MNode> {
  (context: MiddlewareContext, node: T, parent?: Parent): VNode | void
}
export type TupledMiddleware<T extends MNode> = [NodeType<T>, Middleware<T>]
export type ChildrenWrapper = (nodes: Array<VNode | MNode>) => Array<VNode | string>
export type MiddlewareContext = {
  h: CreateElement
  commit: MutationCommitter
  wrap: ChildrenWrapper
}

// 変換元となったMarkdown文字列全体を受け取り、変更を反映した文字列を返す
export type Mutator = (src: string) => string

// ミューテータを受け取り、変更をコミットする
export type MutationCommitter = (reflect: Mutator) => void
