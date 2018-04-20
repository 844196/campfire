declare module '*.vue' {
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
