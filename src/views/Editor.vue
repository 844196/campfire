<template lang="pug">
div
  md-field
    label Title
    md-input(v-model="cached.title", @input.native="update")
  md-field
    label Content
    md-textarea(v-model="cached.content", @input.native="update")
</template>

<script>
import debounce from 'throttle-debounce/debounce'

export default {
  name: 'Editor',
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
      return this.$store.getters['memos/findOrEmpty'](this.memoUid)
    }
  },
  watch: {
    'origin': function (origin) {
      this.cached = { ...origin }
    }
  },
  methods: {
    update: debounce(750, function () {
      this.$store.dispatch('memos/edit', {
        memoUid: this.memoUid,
        authorUid: this.authorUid,
        title: this.cached.title,
        content: this.cached.content
      })
    })
  }
}
</script>
