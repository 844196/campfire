declare module 'vfile-message' {
  import { Node, Position, Point } from 'unist'

  export = VMessage

  interface NodeWithPosition extends Node {
    position: Position
    [key: string]: any
  }

  class VMessage {
    new (
      reason: string | Error,
      position?: NodeWithPosition | Position | Point,
      origin?: string
    ): VMessage

    file: string
    ruleId: string
    reason: string
    line: number | null
    column: number | null
    location: Position
    source: string | null
    fatal?: boolean | null
  }
}
