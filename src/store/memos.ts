import firebase from '@/firebase'
import { firebaseAction } from 'vuexfire'
import { DefineGetters, DefineMutations, DefineActions } from 'vuex-type-helper'

const memosRef = firebase.database().ref('memos')

type Memo = any

export interface State {
  all: Array<Memo>
}
const state: State = {
  all: []
}

export interface Getters {
  findOrEmpty: (memoUid: string) => Memo
}
const getters: DefineGetters<Getters, State> = {
  findOrEmpty (state) {
    return (memoUid: string) => {
      return state.all.find((m: Memo) => m['.key'] === memoUid) || { title: '', content: '' }
    }
  }
}

export interface Mutations {}
const mutations: DefineMutations<Mutations, State> = {}

export interface Actions {
  init: void
  edit: {
    memoUid: string,
    authorUid: string,
    title: string,
    content: string
  }
}
const actions: DefineActions<Actions, State, Mutations, Getters> = {
  init: firebaseAction(({ bindFirebaseRef }: any) => {
    bindFirebaseRef('all', memosRef)
  }),
  edit: firebaseAction((_: any, { memoUid, authorUid, title, content }: any) => {
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
