import firebase from '@/firebase'
import { firebaseAction } from 'vuexfire'

const memosRef = firebase.database().ref('memos')

export default {
  namespaced: true,
  state: {
    all: []
  },
  getters: {
    findOrEmpty (state) {
      return (uid) => state.all.find(m => m['.key'] === uid) || { title: '', content: '' }
    }
  },
  mutations: {
    loaded (state) {
      state.loaded = true
    }
  },
  actions: {
    init: firebaseAction(({ commit, bindFirebaseRef }) => {
      bindFirebaseRef('all', memosRef)
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
}
