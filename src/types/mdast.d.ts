declare module 'mdast' {
  import { Parent, Text, Node } from 'unist'

  export = MDAST

  namespace MDAST {
    interface Root extends Parent {
      type: 'root'
    }

    interface Code extends Text {
      type: 'code'
      lang: string | null
    }

    interface ListItem extends Parent {
      type: 'listItem'
      loose: boolean
      checked: boolean | null
    }

    interface Heading extends Parent {
      type: 'heading'
      depth: 1 | 2 | 3 | 4 | 5 | 6
    }

    interface Paragraph extends Parent {
      type: 'paragraph'
    }

    interface TextNode extends Text {
      type: 'text'
    }

    interface Link extends Parent {
      type: 'link'
      title: string | null
      url: string
    }

    interface Image extends Node {
      type: 'image'
      title: string | null
      alt: string | null
      url: string
    }

    interface LinkReference extends Parent {
      type: 'linkReference'
      identifier: string
      referenceType: 'shortcut' | 'collapsed' | 'full'
    }

    interface ImageReference extends Node {
      type: 'imageReference'
      identifier: string
      referenceType: 'shortcut' | 'collapsed' | 'full'
      alt: string | null
    }

    interface Definition extends Node {
      type: 'definition'
      identifier: string
      title: string | null
      url: string
    }
  }
}
