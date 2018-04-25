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
    name: 'home',
    component: view('Home'),
    beforeEnter (to, _, next) {
      if (store.getters['auth/authed']) {
        next()
      } else {
        next({ name: 'login', query: { redirect: to.fullPath } })
      }
    },
    children: [
      {
        path: 'new',
        name: 'new',
        redirect: () => ({
          name: 'edit',
          params: { memoUUID: UUID.generate().toString() }
        })
      },
      {
        path: 'edit/:memoUUID',
        name: 'edit',
        component: view('Editor'),
        props: ({ params }) => ({
          memo: store.getters['memos/findOrEmpty'](UUID.valueOf(params.memoUUID), store.state.auth.user!.uid)
        })
      }
    ]
  }
]

export default routes
