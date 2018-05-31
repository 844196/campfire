declare module 'mdast-util-to-hast' {
  import { Node } from 'unist'
  import { Root, Element, TextNode, Doctype, Comment } from 'hast'

  export type Handler = (h: Function, node: any, parent: any) => any

  export type Options = {
    allowDangerousHTML?: boolean
    commonmark?: boolean
    handlers?: { [key: string]: Handler }
  }

  export default function toHAST (node: Node, options?: Options): Root | Element | TextNode | Doctype | Comment
}

declare module 'mdast-util-to-hast/lib/handlers' {
  import { Options } from 'mdast-util-to-hast'

  declare const handlers: Required<Options>['handlers']
  export = handlers
}
