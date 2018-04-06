<template lang="pug">
div
  div(v-for="memo in memos")
    div
      router-link(:to="{ name: 'edit', params: { memoUid: memo.memoUid } }")
        span {{ memo.title }}
        span {{ memo.updatedAt }}
      button(@click="deleteMemo(memo.memoUid)") Delete
  div
    span {{ user.email }}
      button(@click="logout") Logout
  router-view
</template>

<script lang="ts">
import Vue from 'vue'
import { authHelpers } from '@/store/auth'
import { memosHelpers } from '@/store/memos'

export default Vue.extend({
  name: 'Home',
  computed: {
    ...authHelpers.mapState(['user']),
    ...memosHelpers.mapGetters({ memos: 'all' })
  },
  created () {
    this._memosInit(undefined)
  },
  methods: {
    ...authHelpers.mapActions({ _logout: 'logout' }),
    ...memosHelpers.mapActions({ _memosInit: 'init' }),
    async deleteMemo (memoUid: string) {
      await this.$store.dispatch('memos/delete', { memoUid })
    },
    async logout () {
      await this._logout(undefined)
      this.$router.push({ name: 'login' })
    }
  }
})
</script>
