import firebase from '@/firebase'

export default {
  namespaced: true,
  state: {
    user: null
  },
  getters: {
    authed: state => !!state.user
  },
  mutations: {
    changeUser (state, user) {
      state.user = user
    }
  },
  actions: {
    init ({ commit }) {
      return new Promise(resolve => {
        let unsubFunc
        unsubFunc = firebase.auth().onAuthStateChanged(user => {
          commit('changeUser', user || null)
          unsubFunc()
          resolve()
        })
      })
    },
    login ({ commit }, { email, password }) {
      return firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
        commit('changeUser', user)
      })
    },
    logout ({ commit }) {
      return firebase.auth().signOut().then(() => {
        commit('changeUser', null)
      })
    }
  }
}
