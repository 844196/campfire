<template lang="pug">
div
  md-field
    label Title
    md-input(v-model="cached.title", @input.native="update")
  md-field
    label Content
    md-textarea(v-model="cached.content", @input.native="update")
  previewer(v-model="cached.content")
</template>

<script>
import Vue from 'vue'
import Previewer from '@/components/Previewer.vue'
import debounce from 'throttle-debounce/debounce'

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
    authorUid () {
      return this.$store.state.auth.user.uid
    },
    origin () {
      return this.$store.getters['memos/findOrEmpty'](this.memoUid, this.authorUid)
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
    update: debounce(750, async function () {
      await this.$store.dispatch('memos/createOrUpdate', { memo: this.cached })
      this.$store.dispatch('snackbar/show', {
        message: 'Autosave completed',
        duration: 2000
      })
    })
  }
})
</script>
