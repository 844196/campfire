import Vue from 'vue'
import Vuex from 'vuex'
import auth from '@/store/auth'
import memos from '@/store/memos'
import { firebaseMutations } from 'vuexfire'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    memos
  },
  mutations: firebaseMutations
})
