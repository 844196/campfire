import { createNamespacedHelpers } from 'vuex'
import { DefineActions, DefineGetters, DefineMutations } from 'vuex-type-helper'

export interface State {
  display: boolean
}
const state: State = {
  display: true
}

export interface Getters {
  display: boolean
}
const getters: DefineGetters<Getters, State> = {
  display: ({ display }) => display
}

export interface Mutations {
  toggleDisplay: undefined
}
const mutations: DefineMutations<Mutations, State> = {
  toggleDisplay: (state) => { state.display = !state.display }
}

export interface Actions {
  toggleDisplay: undefined
}
const actions: DefineActions<Actions, State, Mutations, Getters> = {
  toggleDisplay: ({ commit }) => commit('toggleDisplay', undefined)
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

export const memoListHelpers = createNamespacedHelpers<State, Getters, Mutations, Actions>('memoList')
