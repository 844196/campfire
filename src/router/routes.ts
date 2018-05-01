import { RouteConfig } from 'vue-router'
import store from '@/store'
import UUID from '@/utils/uuid'

const v = (name: string) => require(`@/views/${name}.vue`).default
const c = (name: string) => require(`@/components/${name}.vue`).default

const routes: RouteConfig[] = [
  {
    path: '/login',
    name: 'login',
    component: v('Login')
  },
  {
    path: '/tree',
    component: v('Tree')
  },
  {
    path: '/',
    name: 'main',
    component: v('Main'),
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
        component: v('Memos'),
        children: [
          {
            path: '',
            name: 'memoHome',
            component: c('MemoEmptyState')
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
            component: c('MemoEditor'),
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
