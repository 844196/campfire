declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
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
