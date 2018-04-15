import firebase from '@/firebase'
import { firebaseAction } from 'vuexfire'
import { createNamespacedHelpers } from 'vuex'
import { DefineGetters, DefineMutations, DefineActions } from 'vuex-type-helper'
import Memo, { RawMemo } from '@/models/memo'
import UUID from '@/utils/uuid'

const memosRef = firebase.database().ref('memos')

export interface State {
  raws: Array<RawMemo>
}
const state: State = {
  raws: []
}

export interface Getters {
  all: Array<Memo>
  findOrEmpty: (uuid: UUID, authorUid: string) => Memo | null
}
const getters: DefineGetters<Getters, State> = {
  all (state) {
    return state.raws.map(raw => Memo.inflate(raw)).sort((a, b) => {
      if (a.updatedAt < b.updatedAt) return 1
      if (a.updatedAt > b.updatedAt) return -1
      return 0
    })
  },
  findOrEmpty (_, getters) {
    return (uuid, authorUid) => getters.all.find(m => m.uuid.isEqual(uuid)) || Memo.empty(uuid, authorUid)
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
    uuid: UUID
  }
}
const actions: DefineActions<Actions, State, Mutations, Getters> = {
  init: firebaseAction(({ bindFirebaseRef }) => {
    bindFirebaseRef('raws', memosRef)
  }),
  createOrUpdate: firebaseAction((_, { memo }) => {
    memosRef.child(memo.uuid.toString()).set(memo.deflateForPersist(new Date()))
  }),
  delete: firebaseAction((_, { uuid }) => {
    memosRef.child(uuid.toString()).remove()
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
