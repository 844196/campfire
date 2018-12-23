declare module 'mdast-util-definitions' {
  import { Node } from 'unist'
  import { Definition } from 'mdast'

  export type Getter = (identifier: string) => Definition | null
  export type Options = { commonmark: boolean }

  export default function definitions (node: Node, options?: Options): Getter
}
