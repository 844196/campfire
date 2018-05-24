declare module 'unist' {
  export = Unist

  namespace Unist {
    interface Node {
      type: string
      data?: Data
      position?: Position
    }

    interface Data {
      [key: string]: string | number | object | Array<any> | boolean | null
    }

    interface Position {
      start: Point
      end: Point
      indent?: Array<number>
    }

    interface Point {
      line: number
      column: number
      offset?: number
    }

    interface Parent extends Node {
      children: Array<Node>
    }

    interface Text extends Node {
      value: string
    }
  }
}
