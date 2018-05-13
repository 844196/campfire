<template lang="pug">
.memo-list
  router-link.memo-list-item(
    v-for="memo in memos",
    :key="memo.uuid.toString()",
    :to="{ name: 'memo', params: { memoUUID: memo.uuid.toString() } }",
    tag="div"
  )
    .meta-info
      .title {{ memo.title }}
      timeago.updated-at(:since="memo.updatedAt", :auto-update="60", :max-time="60 * 60 * 24")
    .delete(@click="onDelete(memo.uuid)")
      v-icon(name="x")
</template>

<script lang="ts">
import Vue from 'vue'
import Memo from '@/models/memo'
import { memosHelpers } from '@/store/memos'
import UUID from '@/utils/uuid'

export default Vue.extend({
  name: 'MemoList',
  props: {
    memos: {
      type: Array as () => Array<Memo>,
      required: true
    }
  },
  methods: {
    ...memosHelpers.mapActions({ _deleteMemo: 'delete' }),
    async onDelete (uuid: UUID) {
      const confirmed = confirm('Are you sure?')

      if (!confirmed) {
        return
      }

      await this._deleteMemo({ uuid })
    }
  }
})
</script>

<style lang="stylus" scoped>
.memo-list
  font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif
  background-color: #f4f5f7
  padding: .5rem
  overflow-y: auto
  &::-webkit-scrollbar
    width: 7px
  &::-webkit-scrollbar-thumb
    background-color: #bebebe
    border-radius: 3.5px
    &:hover
      background-color: #727272

  .memo-list-item
    display: flex
    justify-content: space-between
    align-items: center
    padding: 8px
    margin: 4px
    cursor: pointer
    .meta-info
      overflow: hidden
      .title
        font-size: 15px
        color: #42526e
        overflow: hidden
        white-space: nowrap
        text-overflow: ellipsis
      .updated-at
        font-size: 10px
        color: #a5adba
    .delete
      display: none
    &:hover, &.router-link-active
      background-color: rgba(9, 30, 66, 0.04)
      border-radius: 3px
    &.router-link-active
      .meta-info
        .title
          color: #0052cc
        .updated-at
          color: #5e6c84
    &:hover
      .delete
        curosr: pointer
        display: block
        color: #a5adba
        &:hover
          color: #091e42
        .icon
          width: 17px
</style>
