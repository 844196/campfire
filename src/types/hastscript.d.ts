declare module 'hastscript' {
  import { Node } from 'unist'
  import { Element } from 'hast'

  export = h

  function h (
    selector?: string,
    properties?: { [key: string]: any },
    children?: Array<string | Node>
  ): Element
}
