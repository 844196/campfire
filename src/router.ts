import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Editor from '@/views/Editor.vue'
import store from '@/store'
import uuid from 'uuid/v4'

Vue.use(Router)

const router = new Router({
  mode: 'history',
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
          component: Editor,
          props: () => {
            return { memoUid: uuid() }
          }
        },
        {
          path: 'edit/:memoUid',
          name: 'edit',
          component: Editor,
          props: true
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
