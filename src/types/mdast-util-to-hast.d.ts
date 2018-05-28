declare module 'mdast-util-to-hast' {
  import { Root } from 'hast'

  export type Handler = (h: Function, node: any, parent: any) => any

  export type Options = {
    allowDangerousHTML?: boolean
    commonmark?: boolean
    handlers?: { [key: string]: Handler }
  }

  export default function toHAST (node: any, options?: Options): Root
}

declare module 'mdast-util-to-hast/lib/handlers' {
  import { Options } from 'mdast-util-to-hast'

  declare const handlers: Required<Options>['handlers']
  export = handlers
}
