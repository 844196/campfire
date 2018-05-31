import { mapValues } from 'lodash'
import { VNode } from 'vue'
import {
  BundledHandlers,
  CustomHandler,
  CustomHandlerPayloadHelpers,
  MNode,
  NodeType
} from './types'

export default class CustomHandlerSet {
  private defaultHandlers: BundledHandlers
  private customHandlers: { [key: string]: Array<CustomHandler<any>> }

  constructor (defaultHandlers: BundledHandlers) {
    this.defaultHandlers = defaultHandlers
    this.customHandlers = {}
  }

  add<T extends MNode> (type: NodeType<T>, handler: CustomHandler<T>): this {
    if (!this.customHandlers[type]) {
      this.customHandlers[type] = []
    }
    this.customHandlers[type].push(handler)
    return this
  }

  bundle (helpers: CustomHandlerPayloadHelpers): BundledHandlers {
    return mapValues(this.customHandlers, (handlers, type) => {
      return (u: Function, node: MNode, parent: MNode) => {
        let vnode: VNode | undefined
        for (const handler of handlers) {
          const v = handler(node, { parent, ...helpers })
          if (v) {
            vnode = v
            break
          }
        }
        return vnode || this.defaultHandlers[type](u, node, parent)
      }
    })
  }
}
