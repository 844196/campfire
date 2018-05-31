declare module 'unist-util-visit' {
  import { Node } from 'unist'

  export type CONTINUE = true | void
  export type SKIP = 'skip'
  export type EXIT = false

  type Visitor<T> = (
    node: T,
    index: number | null,
    parent: Node | null
  ) => CONTINUE | SKIP | EXIT | number

  export default function visit<T extends Node> (
    node: Node,
    test: T['type'],
    visitor: Visitor<T>
  ): void
}
