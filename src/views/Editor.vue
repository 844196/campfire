<template lang="pug">
form(@submit.prevent="onSubmit")
  md-field
    label Title
    md-input(v-model="memoOrEmpty.title")
  md-field
    label Content
    md-textarea(v-model="memoOrEmpty.content")
  md-button(type="submit").md-raised.md-primary save
</template>

<script>
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
      memo: {}
    }
  },
  computed: {
    memoOrEmpty () {
      const m = { ...this.$store.getters['memos/findOrEmpty'](this.memoUid) }
      this.memo = m // eslint-disable-line vue/no-side-effects-in-computed-properties
      return m
    }
  },
  methods: {
    onSubmit () {
      this.$store.dispatch('memos/edit', {
        memoUid: this.memoUid,
        authorUid: this.$store.getters['auth/user'].uid,
        title: this.memo.title,
        content: this.memo.content
      })
    }
  }
}
</script>
