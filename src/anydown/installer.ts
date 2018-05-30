import { Component } from 'vue'
import installCompiler from './compiler'
import CustomHandlerSet from './custom-handler'
import installParser from './parser'
import { reflectToCodeBlock } from './reflector'
import installRenderer from './renderer'
import { CustomHandler, MNode, MNodeCode, MNodeType } from './types'

export default class Installer {
  private customHandlers = new CustomHandlerSet()

  addAnydownComponent (lang: string, component: Component<any, any, any, any>) {
    this.customHandlers.add<MNodeCode>('code', (node, _, { h, onInput }) => {
      if (node.lang !== lang) {
        return
      }
      return h(component, {
        on: {
          input: (value: string) => onInput(reflectToCodeBlock(value, node.position!))
        },
        props: {
          value: node.value
        }
      })
    })
    return this
  }

  addCustomHandler<T extends MNode> (type: MNodeType<T>, customHandler: CustomHandler<T>) {
    this.customHandlers.add<T>(type, customHandler)
    return this
  }

  install () {
    return installRenderer(
      installParser(),
      installCompiler(this.customHandlers)
    )
  }
}
