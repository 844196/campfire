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
