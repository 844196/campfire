import Vue from 'vue'
import Vuex from 'vuex'
import { firebaseMutations } from 'vuexfire'
import auth from '@/store/auth'
import memoList from '@/store/memo-list'
import memos from '@/store/memos'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    memos,
    memoList
  },
  mutations: firebaseMutations
})
