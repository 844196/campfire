<template lang="pug">
div
  md-field
    label Content
    md-textarea(v-model="memo.content", @input.native="createOrUpdate")
  previewer(v-model="memo.content")
</template>

<script lang="ts">
import Vue from 'vue'
import Previewer from '@/components/Previewer.vue'
import { debounce } from 'throttle-debounce'

export default Vue.extend({
  name: 'Editor',
  components: {
    Previewer
  },
  props: {
    memo: {
      type: Object,
      required: true
    }
  },
  methods: {
    createOrUpdate: debounce(750, async function (this: any) {
      await this.$store.dispatch('memos/createOrUpdate', {
        memo: this.memo
      })
      await this.$store.dispatch('snackbar/show', {
        message: 'Autosave completed',
        duration: 2000
      })
    })
  }
})
</script>
