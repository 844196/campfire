/* eslint-disable import/no-duplicates */
/* eslint-disable import/export */

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'vue/dist/vue.esm' {
  import Vue from 'vue'
  export default Vue
}

declare module 'is-uuid' {
  function v1 (str: string): boolean
  function v2 (str: string): boolean
  function v3 (str: string): boolean
  function v4 (str: string): boolean
  function anyNonNil (str: string): boolean
  function nil (str: string): boolean
}

declare module 'plantuml-encoder' {
  function encode (content: string): string
}

declare module 'vue-routisan' {
  import { RouteConfig, NavigationGuard, RedirectOption } from 'vue-router'

  type Component = RouteConfig['component']
  type Guard = NavigationGuard | NavigationGuard[]
  type RouteOptions = Pick<RouteConfig & { prefix?: string },
    | 'name'
    | 'components'
    | 'redirect'
    | 'props'
    | 'alias'
    | 'children'
    | 'beforeEnter'
    | 'meta'
    | 'caseSensitive'
    | 'pathToRegexpOptions'
    | 'prefix'
  >
  type GroupOptions = {
    prefix?: string
    beforeEnter?: Guard
  }
  // eslint-disable-next-line space-infix-ops
  type Resolver<T = any> = (param: T) => Component

  class Route {
    options (options: RouteOptions): Route
    name (name: string): Route
    guard (guard: Guard): Route
    children (routes: () => void): Route
  }

  class Routisan {
    setViewResolver<T = any> (resolver: Resolver<T>): void
    view<T = any> (path: string, component: any): Route
    redirect (path: string, redirect: RedirectOption): Route
    group (options: GroupOptions, routes: () => void): void
    all (): RouteConfig[]
  }

  declare var r: Routisan

  export = r
}

// FIXIME コールバックの型が正しくない
type BindOptions = {
  cancelCallback?: () => void
  readyCallback?: () => void
  errorCallback?: () => void
  wait?: boolean
}

// eslint-disable-next-line space-infix-ops
type BindHelpers<C> = {
  bindFirebaseRef: (
    key: keyof C['state'],
    source: firebase.database.Reference,
    options?: BindOptions
  ) => void
  unbindFirebaseRef: (key: keyof C['state']) => void
}

declare module 'vuexfire' {
  function firebaseAction<C, A> (
    action: (
      context: C & BindHelpers<C>,
      payload: A
    ) => any
  ): (context: C, payload: A) => void | Promise<any>

  // FIXME 実際にはミューテーションをコミットするコールバックが格納されている
  const firebaseMutations: any
}

declare module 'unist' {
  export = Unist

  namespace Unist {
    interface Node {
      type: string
      data?: Data
      position?: Position
    }

    interface Data {
      // empty
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

declare module 'mdast' {
  import { Text } from 'unist'

  export = MDAST

  namespace MDAST {
    interface Code extends Text {
      type: 'code',
      lang: string | null
    }

    interface HTML extends Text {
      type: 'html'
    }
  }
}

declare module 'unist-util-visit' {
  import { Node, Parent } from 'unist'

  var Visit: Visit.Visit
  export = Visit

  namespace Visit {
    type EXIT = false
    type CONTINUE = true
    type SKIP = 'skip'

    interface Visit {
      <T = Node>(node: Node, visitor: Visitor<T>, reverse: boolean = false): void
      <T = Node>(node: Node, test: any, visitor: Visitor<T>, reverse: boolean = false): void
    }

    interface Visitor<T = Node> {
      (
        node: T,
        index: number | null,
        parent: Parent | null
      ): EXIT | CONTINUE | SKIP | number | void
    }
  }
}

declare module 'vfile-message' {
  import { Node, Position, Point } from 'unist'

  interface VMessage {
    reason: string
    fatal?: boolean | null
    line: number | null
    column: number | null
    source: string | null
    ruleId: string | null
    stack: string | null

    new (
      reason: string | Error,
      position?: Node | Position | Point,
      origin?: string
    )
  }
}

declare module 'vfile' {
  import VMessage from 'vfile-message'
  import { Node, Position, Point } from 'unist'

  interface VFileStatic {
    (value?: string): VFile.VFile<string>
    (value: Buffer): VFile.VFile<Buffer>
    <T> (value: VFile.VFile<T>): VFile.VFile<T>
  }

  var VFile: VFileStatic
  export = VFile

  namespace VFile {
    interface VFile<T> {
      contents: T | null
      cwd: string
      path?: string
      basename?: string
      stem?: string
      extname?: string
      dirname?: string
      history: Array<string>
      messages: Array<VMessage>
      data: any

      toString (encoding?: string): string

      message (
        reason: string | Error,
        position?: Node | Position | Point,
        origin?: string
      ): VMessage
      info (
        reason: string | Error,
        position?: Node | Position | Point,
        origin?: string
      ): VMessage
      fail (
        reason: string | Error,
        position?: Node | Position | Point,
        origin?: string
      ): never
    }

    type ConstructorParam = string | Buffer | VFile
  }
}

declare module 'unified' {
  import { VFile, ConstructorParam as VFileParam } from 'vfile'
  import { Node } from 'unist'

  var Unified: () => Unified.Processor
  export = Unified

  namespace Unified {
    interface Processor {
      use (plugin: Attacher<never>): Processor
      use <T>(plugin: Attacher<T>, options: T): Processor

      parse (file: VFile | VFileParam): Node

      stringify (node: Node, file?: VFile | VFileParam): string

      run (
        node: Node,
        file?: VFile | VFileParam,
        done?: (err: Error | null, node?: Node, file?: VFile) => void
      ): Promise<Node>
      runSync (node: Node, file?: VFile | VFileParam): Node

      process (file: VFile | string): Promise<VFile>
      process (
        file: VFile | string,
        done: (err: Error | null, file: VFile) => void
      ): void
      processSync (file: VFile | string): VFile

      data (key: string): any
      data (key: string, value: any): Processor

      freeze (): Processor
    }

    interface Attacher<T> {
      (this: Processor, options: T): Transformer | void
    }

    interface Transformer {
      (
        node: Node,
        file: VFile,
        next?: (err: Error | null, node?: Node, file?: VFile) => void
      ): Error | Node | Promise<Node>
    }
  }
}

declare module 'remark-parse'
declare module 'remark-html'

declare module 'vue-codemirror-lite'
declare module 'markdown-it-link-attributes'
