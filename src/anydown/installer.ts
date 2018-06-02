import { Code as CodeBlock } from 'mdast'
import defaultHandlers from 'mdast-util-to-hast/lib/handlers'
import { Component } from 'vue'
import installCompiler from './compiler'
import CustomHandlerSet from './custom-handler'
import installParser from './parser'
import { reflectToCodeBlock } from './reflector'
import installRenderer from './renderer'
import { CustomHandler, MNode, NodeType } from './types'

type NodeMatcher = (node: CodeBlock, parent: MNode) => boolean

export default class Installer {
  private customHandlers = new CustomHandlerSet(defaultHandlers)

  addAnydownComponent (lang: string | Array<string> | NodeMatcher, component: Component<any, any, any, any>) {
    this.customHandlers.add<CodeBlock>('code', (node, { parent, h, onInput }) => {
      if (typeof lang === 'string') {
        if (node.lang !== lang) {
          return
        }
      } else if (lang instanceof Array) {
        if (node.lang === null || !lang.includes(node.lang)) {
          return
        }
      } else {
        if (!lang(node, parent)) {
          return
        }
      }
      return h(component, {
        on: {
          input: (value: string) => onInput(reflectToCodeBlock(value, node.position!))
        },
        props: {
          value: node.value,
          info: node.lang === null ? '' : node.lang
        }
      })
    })
    return this
  }

  addCustomHandler<T extends MNode> (type: NodeType<T>, customHandler: CustomHandler<T>) {
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
