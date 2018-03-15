<template lang="pug">
div
  md-field
    label Content
    md-textarea(v-model="cached.content", @input.native="createOrUpdate")
  previewer(v-model="cached.content")
</template>

<script lang="ts">
import Vue from 'vue'
import Previewer from '@/components/Previewer.vue'
import { debounce } from 'throttle-debounce'
import { authHelpers } from '@/store/auth'
import { Memo } from '@/domain/memo'

export default Vue.extend({
  name: 'Editor',
  components: {
    Previewer
  },
  props: {
    memoUid: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      cached: {}
    }
  },
  computed: {
    ...authHelpers.mapState({ author: 'user' }),
    origin (): Memo {
      return this.$store.getters['memos/findOrEmpty'](this.memoUid, this.author!.uid)
    }
  },
  watch: {
    'origin': function () {
      this.setCache()
    }
  },
  created () {
    this.setCache()
  },
  methods: {
    setCache () {
      this.cached = this.origin
    },
    createOrUpdate: debounce(750, async function (this: any) {
      await this.$store.dispatch('memos/createOrUpdate', {
        memo: this.cached
      })
      await this.$store.dispatch('snackbar/show', {
        message: 'Autosave completed',
        duration: 2000
      })
    })
  }
})
</script>
