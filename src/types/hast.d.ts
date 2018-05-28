declare module 'hast' {
  import { Parent, Node, Text } from 'unist'

  export = HAST

  namespace HAST {
    interface Root extends Parent {
      type: 'root'
    }

    interface ElementProperties {
      className?: Array<string>
      htmlFor?: string
      [key: string]: any
    }

    interface Element extends Parent {
      type: 'element'
      tagName: string
      properties: ElementProperties
      content: Root | null
    }

    interface Doctype extends Node {
      type: 'doctype'
      name: string
      public: string | null
      system: string | null
    }

    interface Comment extends Text {
      type: 'comment'
    }

    interface TextNode extends Text {
      type: 'text'
    }
  }
}
