<template lang="pug">
#root
  nav.sidebar(v-show="isSidebarVisible")
    header.header
      h1.title Inbox
      router-link(:to="{ name: 'new' }")
        v-icon(name="plus-circle")
    .memolist
      router-link.memolist-item(
        v-for="memo in memos",
        :key="memo.uuid.toString()",
        :to="{ name: 'edit', params: { memoUUID: memo.uuid.toString() } }",
        tag="div"
      )
        div.meta-info
          .title {{ memo.title }}
          timeago.updated-at(:since="memo.updatedAt", :auto-update="60")
        nav.more-menu
          el-dropdown(@command="deleteMemo")
            span
              v-icon(name="more-vertical")
            el-dropdown-menu(slot="dropdown")
              el-dropdown-item(:command="memo.uuid") 削除
  .sidebar-handle(@click="isSidebarVisible = !isSidebarVisible", :class="{ inverted: isSidebarVisible }")
    v-icon(:name="isSidebarVisible ? 'chevron-left' : 'chevron-right'")
  main.main
    router-view
</template>

<script lang="ts">
import Vue from 'vue'
import { authHelpers } from '@/store/auth'
import { memosHelpers } from '@/store/memos'
import UUID from '@/utils/uuid'

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
    this.initMemos(undefined)
  },
  methods: {
    ...memosHelpers.mapActions({
      'initMemos': 'init',
      '_deleteMemo': 'delete'
    }),
    ...authHelpers.mapActions({
      '_logout': 'logout'
    }),
    async deleteMemo (uuid: UUID) {
      await this._deleteMemo({ uuid })
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
      font: inherit
      margin: 0
      font-size: 32px
    .icon
      height: 24px
      width: 24px
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
    display: flex
    justify-content: space-between
    align-items: center
    &:hover, &.router-link-active
      background-color: #0049b0
      border-radius: .2em
      .meta-info
        .title
          color: #ffffff
        .updated-at
          color: #74a1e3
    &.router-link-active
      .more-menu
        display: block
      .more-menu .icon
        color: #74a1e3
    .meta-info
      overflow: hidden
      .title
        overflow: hidden
        white-space: nowrap
        text-overflow: ellipsis
        color: #8bb0e8
        font-size: 16px
      .updated-at
        color: #5d91df // https://meyerweb.com/eric/tools/color-blend/#0052CC:FFFFFF:10:hex
        font-size: 11px
    .more-menu
      display: none
.sidebar-handle
  display: flex
  justify-content: center
  align-items center
  height: 100%
  transition: all .3s
  .icon
    width: .8em
    color: #0052cc
  &.inverted
    background-color: #0052cc
    border-left: 1px solid #0043a7
    .icon
      color: #ffffff
  &:hover
    transition: all .3s
    background-color: #0043a7
    .icon
      color: #ffffff
.main
  flex: 2
  width: auto
  height: 100%
</style>
