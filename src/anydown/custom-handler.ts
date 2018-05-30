import { mapValues } from 'lodash'
import {
  BundledHandlers,
  ChildrenConverter,
  CustomHandler,
  InputHandler,
  MNode,
  VNode,
  VNodeFactory
} from './types'

export default class CustomHandlerSet {
  private customHandlers: { [key: string]: Array<CustomHandler<any>> } = {}

  add<T extends MNode> (type: T['type'], handler: CustomHandler<T>): this {
    if (!this.customHandlers[type]) {
      this.customHandlers[type] = []
    }
    this.customHandlers[type].push(handler)
    return this
  }

  bundle (
    vnodeFactory: VNodeFactory,
    inputHandler: InputHandler,
    childrenConverter: ChildrenConverter,
    defaultHandlers: BundledHandlers
  ): BundledHandlers {
    return mapValues(this.customHandlers, (handlers, type) => {
      return (u: Function, node: MNode, parent: MNode) => {
        let vnode: VNode | undefined
        for (const handler of handlers) {
          const v = handler(node, parent, {
            h: vnodeFactory,
            onInput: inputHandler,
            convertChildren: childrenConverter
          })
          if (v) {
            vnode = v
            break
          }
        }
        return vnode || defaultHandlers[type](u, node, parent)
      }
    })
  }
}
