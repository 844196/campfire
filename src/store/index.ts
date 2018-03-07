import Vue from 'vue'
import Vuex from 'vuex'
import auth from '@/store/auth'
// import memos from '@/store/memos'
// import snackbar from '@/store/snackbar'
import { firebaseMutations } from 'vuexfire'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    // memos,
    // snackbar
  },
  mutations: firebaseMutations
})
