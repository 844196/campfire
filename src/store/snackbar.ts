import { createNamespacedHelpers } from 'vuex'
import { DefineMutations, DefineActions, DefineGetters } from 'vuex-type-helper'

type PositionType = 'left' | 'center'
type SnackbarOptions = {
  position: PositionType
  duration: number
}

const DEFAULT_OPTIONS: SnackbarOptions = {
  position: 'left',
  duration: 5000
}

export interface State {
  visible: boolean
  message: string
  options: SnackbarOptions
}
const state: State = {
  visible: false,
  message: '',
  options: DEFAULT_OPTIONS
}

export interface Getters {}
const getters: DefineGetters<Getters, State> = {}

export interface Mutations {
  show: {
    message: string,
    options: SnackbarOptions
  }
  changeVisibility: boolean
}
const mutations: DefineMutations<Mutations, State> = {
  show (state, { message, options }) {
    state.visible = true
    state.message = message
    state.options = options
  },
  changeVisibility (state, visibility) {
    state.visible = visibility
  }
}

export interface Actions {
  show: {
    message: string,
    position?: PositionType,
    duration?: number
  }
}
const actions: DefineActions<Actions, State, Mutations> = {
  show ({ commit }, { message, position, duration }) {
    commit('show', {
      message,
      options: {
        position: position || DEFAULT_OPTIONS.position,
        duration: duration || DEFAULT_OPTIONS.duration
      }
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

const {
  mapState,
  mapGetters,
  mapMutations,
  mapActions
} = createNamespacedHelpers<State, Getters, Mutations, Actions>('snackbar')
export {
  mapState as mapSnackbarState,
  mapGetters as mapSnackbarGetters,
  mapMutations as mapSnackbarMutations,
  mapActions as mapSnackbarActions
}
