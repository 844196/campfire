import { RouteConfig } from 'vue-router'
import store from '@/store'
import UUID from '@/utils/uuid'

const view = (name: string) => require(`@/views/${name}.vue`).default

const routes: RouteConfig[] = [
  {
    path: '/login',
    name: 'login',
    component: view('Login')
  },
  {
    path: '/',
    name: 'main',
    component: view('Main'),
    beforeEnter (to, _, next) {
      if (store.getters['auth/authed']) {
        next()
      } else {
        next({ name: 'login', query: { redirect: to.fullPath } })
      }
    },
    children: [
      {
        path: 'memos/new',
        name: 'new',
        redirect: () => ({
          name: 'memo',
          params: { memoUUID: UUID.generate().toString() }
        })
      },
      {
        path: 'memos/:memoUUID',
        name: 'memo',
        component: view('Memos'),
        props: ({ params }) => ({
          memo: store.getters['memos/findOrEmpty'](UUID.valueOf(params.memoUUID), store.state.auth.user!.uid)
        })
      }
    ]
  }
]

export default routes
