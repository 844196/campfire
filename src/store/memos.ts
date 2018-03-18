import firebase from '@/firebase'
import { firebaseAction } from 'vuexfire'
import { createNamespacedHelpers } from 'vuex'
import { DefineGetters, DefineMutations, DefineActions } from 'vuex-type-helper'
import { RawMemo, Memo } from '@/domain/memo'

const memosRef = firebase.database().ref('memos')

export interface State {
  raws: Array<RawMemo>
}
const state: State = {
  raws: []
}

export interface Getters {
  all: Array<Memo>
  findOrEmpty: (memoUid: string, authorUid: string) => Memo
}
const getters: DefineGetters<Getters, State> = {
  all (state) {
    return state.raws.map(raw => Memo.inflate(raw))
  },
  findOrEmpty (_, getters) {
    return (memoUid: string, authorUid: string) => {
      return getters.all.find(m => m.memoUid === memoUid) || Memo.empty(memoUid, authorUid)
    }
  }
}

export interface Mutations {}
const mutations: DefineMutations<Mutations, State> = {}

export interface Actions {
  init: undefined
  createOrUpdate: {
    memo: Memo
  }
  delete: {
    memoUid: string
  }
}
const actions: DefineActions<Actions, State, Mutations, Getters> = {
  init: firebaseAction(({ bindFirebaseRef }) => {
    bindFirebaseRef('raws', memosRef)
  }),
  createOrUpdate: firebaseAction((_, { memo }) => {
    // FIXME 更新日時はMemo自身が返すように
    let deflated = memo.deflate()
    deflated.updatedAt = new Date().toISOString()
    memosRef.child(memo.memoUid).set(deflated)
  }),
  delete: firebaseAction((_, { memoUid }) => {
    memosRef.child(memoUid).remove()
  })
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

export const memosHelpers = createNamespacedHelpers<State, Getters, Mutations, Actions>('memos')
