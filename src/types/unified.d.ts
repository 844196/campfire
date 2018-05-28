declare module 'unified' {
  import { Node } from 'unist'

  const unified: () => Unified
  export default unified

  export interface Unified {
    use (plugin: any): this
    parse (src: string): Node
  }
}
