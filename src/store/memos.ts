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
  edit: {
    memoUid: string,
    authorUid: string,
    title: string,
    content: string
  }
}
const actions: DefineActions<Actions, State, Mutations, Getters> = {
  init: firebaseAction(({ bindFirebaseRef }) => {
    bindFirebaseRef('raws', memosRef)
  }),
  edit: firebaseAction((_, { memoUid, authorUid, title, content }) => {
    memosRef.child(memoUid).set({
      authorUid,
      title,
      content,
      updatedAt: new Date().toISOString()
    })
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
