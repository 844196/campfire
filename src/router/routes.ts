import { NavigationGuard, RouteConfig } from 'vue-router'
import store from '@/store'
import UUID from '@/utils/uuid'

const page = (name: string) => require(`@/views/${name}.vue`).default

const auth: NavigationGuard = (to, _, next) => {
  if (store.getters['auth/authed']) {
    next()
  } else {
    next({ name: 'login', query: { redirect: to.fullPath } })
  }
}

const routes: RouteConfig[] = [
  {
    path: '/login',
    name: 'login',
    component: page('Login')
  },
  {
    path: '/',
    name: 'home',
    component: page('Home'),
    beforeEnter: auth,
    children: [
      {
        path: 'new',
        name: 'new',
        redirect () {
          return { name: 'edit', params: { memoUUID: UUID.generate().toString() } }
        }
      },
      {
        path: 'edit/:memoUUID',
        name: 'edit',
        component: page('Editor'),
        props ({ params }) {
          return { memo: store.getters['memos/findOrEmpty'](UUID.valueOf(params.memoUUID), store.state.auth.user!.uid) }
        }
      }
    ]
  }
]

export default routes
