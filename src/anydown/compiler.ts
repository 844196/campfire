/* eslint-disable no-dupe-class-members */

import { Element as HNodeElement, Root as HNodeRoot, TextNode as HNodeText } from 'hast'
import mapValues from 'lodash/mapValues'
import { Root as MNodeRoot } from 'mdast'
import toHNode, { Handler as ToHNodeHandler } from 'mdast-util-to-hast'
import defaultHandlers from 'mdast-util-to-hast/lib/handlers'
import { CreateElement, VNode } from 'vue'
import { isVNode } from './node-type-guards'
import { replaceReference } from './replace-reference'
import { toVNode } from './to-vnode'
import {
  ChildrenWrapper,
  Compiler,
  MNode,
  Middleware,
  MutationCommitter,
  NodeType,
  TupledMiddleware
} from './types'

/**
 * 事前コンパイラ
 *
 * VNode -> VNode
 * MNodeRoot -> HNodeRoot & { children: Array<VNode | HNodeElement | HNodeText> }
 * MNode -> VNode | HNodeElement | HNodeText
 */
type PartialCompiler = <T extends MNode | VNode>(node: T) => T extends VNode
  ? VNode
  : T extends MNodeRoot
    ? HNodeRoot & { children: Array<VNode | HNodeElement | HNodeText> }
    : VNode | HNodeElement | HNodeText

type PartialCompilerInstaller = (h: CreateElement, commit: MutationCommitter, wrap: ChildrenWrapper) => PartialCompiler

/**
 * 子のいないHASTルートノードを生成する
 */
const createRoot = (): HNodeElement => ({ type: 'element', tagName: 'div', properties: {}, children: [] })

/**
 * 具象コンパイラ
 */
class ConcreteCompiler implements Compiler {
  private installPartialCompiler: PartialCompilerInstaller
  private partialCompile?: PartialCompiler

  constructor (curriedPartialCompiler: PartialCompilerInstaller) {
    this.installPartialCompiler = curriedPartialCompiler
  }

  compile (node: MNodeRoot, h: CreateElement, commit: MutationCommitter): VNode {
    if (!this.partialCompile) {
      const partialCompile = this.installPartialCompiler(h, commit, nodes => {
        return toVNode(h, createRoot(), nodes.map(node => partialCompile(node))).children || []
      })
      this.partialCompile = partialCompile
    }
    return toVNode(h, createRoot(), this.partialCompile(replaceReference(node)).children)
  }
}

/**
 * コンパイラビルダー
 */
export class CompilerBuilder {
  private middlewares: { [key: string]: Array<Middleware<any>> } = {}

  use<T extends MNode> (tupledMiddleware: TupledMiddleware<T>): this
  use<T extends MNode> (type: NodeType<T>, middleware: Middleware<T>): this
  use<T extends MNode> (arg1: NodeType<T> | TupledMiddleware<T>, arg2?: Middleware<T>): this {
    let type: NodeType<T>
    let middleware: Middleware<T>

    if (arg1 instanceof Array) {
      [type, middleware] = arg1
    } else {
      type = arg1
      middleware = arg2!
    }

    if (!this.middlewares[type]) {
      this.middlewares[type] = []
    }
    this.middlewares[type].push(middleware)

    return this
  }

  build (): Compiler {
    const installPartialCompiler: PartialCompilerInstaller = (h, commit, wrap) => {
      const handlers = mapValues(this.middlewares, (middlewares, type) => {
        const handler: ToHNodeHandler = (e, node, parent) => {
          let vnode
          for (const middleware of middlewares) {
            vnode = middleware({ h, commit, wrap }, node, parent)
            if (vnode) {
              break
            }
          }
          return vnode || defaultHandlers[type](e, node, parent)
        }
        return handler
      })
      return node => {
        if (isVNode(node)) {
          return node as any
        }
        return toHNode(node as MNode, { handlers }) as any
      }
    }
    return new ConcreteCompiler(installPartialCompiler)
  }
}
