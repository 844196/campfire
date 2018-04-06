import Vue from 'vue'
import Router, { Route } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Editor from '@/views/Editor.vue'
import store from '@/store'
import uuid from 'uuid/v4'

Vue.use(Router)

const memoInjector = ({ params }: Route): object => {
  const memoUid = params.memoUid || uuid()
  const authorUid = store.state.auth.user!.uid
  return { memo: store.getters['memos/findOrEmpty'](memoUid, authorUid) }
}

const router = new Router({
  mode: 'hash',
  base: '/campfire/',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'new',
          name: 'new',
          redirect: () => {
            const memo = store.getters['memos/findOrEmpty'](uuid(), store.state.auth.user!.uid)
            return { name: 'edit', params: { memoUid: memo.memoUid }, props: { memo } }
          }
        },
        {
          path: 'edit/:memoUid',
          name: 'edit',
          component: Editor,
          props: memoInjector
        }
      ]
    }
  ]
})

router.beforeEach((to, _, next) => {
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
  const authed = store.getters['auth/authed']

  if (requiresAuth && !authed) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
