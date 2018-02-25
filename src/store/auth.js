import firebase from '@/firebase'

export default {
  namespaced: true,
  state: {
    user: null
  },
  getters: {
    user: state => state.user,
    authed: state => !!state.user
  },
  mutations: {
    loggedIn (state, user) {
      state.user = user
    },
    loggedOut (state) {
      state.user = null
    }
  },
  actions: {
    init ({ commit }) {
      return new Promise(resolve => {
        let unsubFunc
        unsubFunc = firebase.auth().onAuthStateChanged(user => {
          commit(user ? 'loggedIn' : 'loggedOut', user)
          unsubFunc()
          resolve()
        })
      })
    },
    login ({ commit }, { email, password }) {
      return firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
        commit('loggedIn', user)
      })
    },
    logout ({ commit }) {
      return firebase.auth().signOut().then(() => {
        commit('loggedOut')
      })
    }
  }
}
