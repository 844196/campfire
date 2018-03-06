const DEFAULT_OPTIONS = {
  position: 'left',
  duration: 5000
}

export default {
  namespaced: true,
  state: {
    visible: false,
    message: '',
    ...DEFAULT_OPTIONS
  },
  mutations: {
    show (state, { message, position, duration }) {
      state.visible = true
      state.message = message
      state.position = position || DEFAULT_OPTIONS.position
      state.duration = duration || DEFAULT_OPTIONS.duration
    },
    changeVisibility (state, value) {
      state.visible = value
    }
  },
  actions: {
    show ({ commit }, { message, position, duration }) {
      commit('show', { message, position, duration })
    }
  }
}
