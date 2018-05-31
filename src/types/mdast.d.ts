declare module 'mdast' {
  import { Parent, Text } from 'unist'

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
  }
}
