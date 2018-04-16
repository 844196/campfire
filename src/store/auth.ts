import { createNamespacedHelpers } from 'vuex'
import { DefineGetters, DefineMutations, DefineActions } from 'vuex-type-helper'
import firebase from '@/firebase'
import { User } from 'firebase'

type AuthCredential = {
  email: string
  password: string
}

export interface State {
  user: User | null
}
const state: State = {
  user: null
}

export interface Getters {
  authed: boolean
}
const getters: DefineGetters<Getters, State> = {
  authed: state => !!state.user
}

export interface Mutations {
  changeUser: User | null
}
const mutations: DefineMutations<Mutations, State> = {
  changeUser (state, userOrNull) {
    state.user = userOrNull
  }
}

export interface Actions {
  init: undefined
  login: AuthCredential
  logout: undefined
}
const actions: DefineActions<Actions, State, Mutations, Getters> = {
  init ({ commit }) {
    return Promise.resolve(() => {
      let unsubFunc = firebase.auth().onAuthStateChanged(user => {
        commit('changeUser', user)
        unsubFunc()
      })
    })
  },
  login ({ commit }, { email, password }) {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(u => { commit('changeUser', u); resolve() })
        .catch(reject)
    })
  },
  logout ({ commit }) {
    return new Promise((resolve, reject) => {
      firebase.auth().signOut()
        .then(() => { commit('changeUser', null); resolve() })
        .catch(reject)
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

export const authHelpers = createNamespacedHelpers<State, Getters, Mutations, Actions>('auth')
