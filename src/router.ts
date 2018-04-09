import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Editor from '@/views/Editor.vue'
import store from '@/store'
import UUID from '@/utils/uuid'

Vue.use(Router)

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
          redirect () {
            return { name: 'edit', params: { memoUUID: UUID.generate().toString() } }
          }
        },
        {
          path: 'edit/:memoUUID',
          name: 'edit',
          component: Editor,
          props ({ params }) {
            return { memo: store.getters['memos/findOrEmpty'](UUID.valueOf(params.memoUUID), store.state.auth.user!.uid) }
          }
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
