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
  }
}
