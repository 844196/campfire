import { RouteConfig } from 'vue-router'
import store from '@/store'
import UUID from '@/utils/uuid'
import LoginView from '@/views/Login.vue'
import MainView from '@/views/Main.vue'
import MemosView from '@/views/Memos.vue'
import MemoEditorView from '@/views/MemoEditor.vue'
import MemoEmptyState from '@/components/atoms/MemoEmptyState.vue'

const routes: RouteConfig[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/',
    name: 'main',
    component: MainView,
    beforeEnter (to, _, next) {
      if (store.getters['auth/authed']) {
        next()
      } else {
        next({ name: 'login', query: { redirect: to.fullPath } })
      }
    },
    children: [
      {
        path: '',
        redirect: { name: 'memoHome' }
      },
      {
        path: 'memos',
        name: 'memos',
        component: MemosView,
        children: [
          {
            path: '',
            name: 'memoHome',
            component: MemoEmptyState
          },
          {
            path: 'new',
            name: 'new',
            redirect: () => ({
              name: 'memo',
              params: { memoUUID: UUID.generate().toString() }
            })
          },
          {
            path: ':memoUUID',
            name: 'memo',
            component: MemoEditorView,
            props: ({ params }) => ({
              memo: store.getters['memos/findOrEmpty'](UUID.valueOf(params.memoUUID), store.state.auth.user!.uid)
            })
          }
        ]
      }
    ]
  }
]

export default routes
