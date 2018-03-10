<template lang="pug">
md-app
  md-app-drawer(md-permanent="full")
    md-list.md-dense.md-double-line
      div(v-for="memo in memos")
        md-list-item(:to="{ name: 'edit', params: { memoUid: memo['.key']} }")
          md-icon description
          .md-list-item-text
            span {{ memo.title }}
            span {{ memo.updatedAt }}
        md-divider
    .user.md-elevation-1
      span(style="flex:1")
        md-icon person
        span(style="margin-left:8px") {{ user.email }}
      md-button(:md-ripple="false", @click="logout").md-dense.md-icon-button
        md-icon exit_to_app
  md-app-content
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
    ...memosHelpers.mapState({ memos: 'all' })
  },
  created () {
    this._memosInit(undefined)
  },
  methods: {
    ...authHelpers.mapActions({ _logout: 'logout' }),
    ...memosHelpers.mapActions({ _memosInit: 'init' }),
    async logout () {
      await this._logout(undefined)
      this.$router.push({ name: 'login' })
    }
  }
})
</script>

<style lang="stylus">
body
  height: 100%
</style>

<style lang="stylus" scoped>
.md-app
  height: 100%
.md-app-container
  height: 100%
.md-drawer
  width: 270px
  max-width: 100%
  background-color: #fafafa
.md-list
  background-color: #fafafa
.user
  position: absolute
  bottom: 0
  box-sizing: border-box
  width: 100%
  background-color: #fafafa
  padding: 16px
  display: flex
  align-items: center
.user *
  vertical-align: middle
.md-empty-state
  height: 100%
</style>
