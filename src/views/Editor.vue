<template lang="pug">
div
  md-field
    label Title
    md-input(v-model="cached.title", @input.native="update")
  md-field
    label Content
    md-textarea(v-model="cached.content", @input.native="update")
  md-snackbar(md-position="left", :md-duration="2000", :md-active.sync="showSnackbar")
    span {{ snackbarMessage }}
    md-button.md-primary(@click="showSnackbar = false") CLOSE
</template>

<script>
import Vue from 'vue'
import debounce from 'throttle-debounce/debounce'

export default Vue.extend({
  name: 'Editor',
  props: {
    memoUid: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      cached: {},
      snackbarMessage: '',
      showSnackbar: false
    }
  },
  computed: {
    authorUid () {
      return this.$store.state.auth.user.uid
    },
    origin () {
      return this.$store.getters['memos/findOrEmpty'](this.memoUid)
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
      this.cached = { ...this.origin }
    },
    update: debounce(750, async function () {
      await this.$store.dispatch('memos/edit', {
        memoUid: this.memoUid,
        authorUid: this.authorUid,
        title: this.cached.title,
        content: this.cached.content
      })
      this.snackbarMessage = 'Autosave completed'
      this.showSnackbar = true
    })
  }
})
</script>
