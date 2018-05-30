import { mapValues } from 'lodash'
import { Options as toHASTOptions } from 'mdast-util-to-hast'
import { Node as MNode } from 'unist'
import { CreateElement, VNode } from 'vue'
import { InputHandler } from './renderer'

type CustomHandler = (
  node: MNode,
  h: CreateElement,
  inputHandler: InputHandler,
  bundledHandlers: BundledHandlers
) => VNode | void
type BundledHandlers = Required<toHASTOptions>['handlers']

export default class CustomHandlerSet {
  private customHandlers: { [key: string]: Array<CustomHandler> } = {}

  add (type: string, handler: CustomHandler): this {
    if (!this.customHandlers[type]) {
      this.customHandlers[type] = []
    }
    this.customHandlers[type].push(handler)
    return this
  }

  bundle (h: CreateElement, inputHandler: InputHandler, defaultHandlers: BundledHandlers): BundledHandlers {
    const bundledHandlers = mapValues(this.customHandlers, (handlers, type) => {
      return (u: Function, node: MNode, parent: MNode) => {
        let vnode: VNode | undefined
        for (const handler of handlers) {
          const v = handler(node, h, inputHandler, bundledHandlers)
          if (v) {
            vnode = v
            break
          }
        }
        return vnode || defaultHandlers[type](u, node, parent)
      }
    })
    return bundledHandlers
  }
}
