import CustomHandlerSet from './custom-handler'
import installParser from './parser'
import installRenderer from './renderer'
import installCompiler from './compiler'
import installReflector from './reflector'
import { isMNodeCode } from './assertion-helper'

export default class Installer {
  private customHandlers = new CustomHandlerSet()

  addAnydownComponent (lang: string, component: any) {
    this.customHandlers.add('code', (node, h, onInput) => {
      if (!isMNodeCode(node)) {
        return
      }
      if (node.lang !== lang) {
        return
      }
      return h(component, {
        on: {
          input: (value: string) => onInput(value, node.position!)
        },
        props: {
          value: node.value
        }
      })
    })
    return this
  }

  install () {
    return installRenderer(
      installParser(),
      installCompiler(this.customHandlers),
      installReflector()
    )
  }
}
