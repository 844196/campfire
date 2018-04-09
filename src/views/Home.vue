<template lang="pug">
#root
  .sidebar(v-if="isSidebarVisible")
    header.header
      h1.title Inbox
      router-link(:to="{ name: 'new' }")
        v-icon(name="plus-circle")
    .memolist
      router-link.memolist-item(v-for="memo in memos", :to="{ name: 'edit', params: { memoUid: memo.memoUid } }", tag="div")
        .title {{ memo.title }}
        .updated-at {{ memo.updatedAt }}
  .sidebar-handle(@click="isSidebarVisible = !isSidebarVisible", :class="{ inverted: isSidebarVisible }")
    v-icon(:name="isSidebarVisible ? 'chevron-left' : 'chevron-right'")
  main.main
    //- span {{ user.email }}
    //-   button(@click="logout") Logout
    router-view.router-view
</template>

<script lang="ts">
import Vue from 'vue'
import { authHelpers } from '@/store/auth'
import { memosHelpers } from '@/store/memos'

export default Vue.extend({
  name: 'Home',
  data () {
    return {
      isSidebarVisible: true
    }
  },
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
    },
    toggleSidebar () {
      this.isSidebarVisible = !this.isSidebarVisible
    }
  }
})
</script>

<style lang="stylus">
html, body
  height: 100%
</style>

<style lang="stylus" scoped>
#root
  height: 100%
  display: flex
.sidebar
  font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif
  display: flex
  flex-flow: column
  background-color: #0052cc
  flex: 1
  min-width: 300px
  max-width: 300px
  height: 100%
  .header
    margin: 35px 11px 14px 11px
    display: flex
    justify-content: space-between
    align-items: center
    .title
      color: #ffffff
      font-size: 32px
    .icon
      height: 28px
      width: 28px
      color: #b9d0f1
      &:hover
        color: #ffffff
.memolist
  overflow-y: auto
  height: 100%
  &::-webkit-scrollbar
    width: .8em
  &::-webkit-scrollbar-thumb
    border-right: .5em solid transparent
    border-top: .5em solid transparent
    border-bottom: .5em solid transparent
    background-clip: padding-box
    background-color: #0049b0
    &:hover
      background-color: #0043a7
  &::-webkit-scrollbar-corner
    background-color: transparent
  .memolist-item
    padding: 11px
    margin: 7px
    &:hover, &.router-link-active
      background-color: #0049b0
      border-radius: .2em
      .title
        color: #ffffff
      .updated-at
        color: #74a1e3
    .title
      color: #8bb0e8
      font-size: 16px
      margin-bottom: .3em
    .updated-at
      color: #5d91df // https://meyerweb.com/eric/tools/color-blend/#0052CC:FFFFFF:10:hex
      font-size: 10px
.sidebar-handle
  display: flex
  justify-content: center
  align-items center
  height: 100%
  .icon
    width: .8em
    color: #0052cc
  &.inverted
    background-color: #0052cc
    border-left: 1px solid #0043a7
    .icon
      color: #ffffff
  &:hover
    background-color: #0043a7
    .icon
      color: #ffffff
.main
  flex: 2
  width: auto
  height: 100%
.router-view
  max-height: calc(100% - 38px)
  padding: 1em
</style>
