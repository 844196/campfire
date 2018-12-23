<template lang="pug">
anydown.markdown-body(:src="value", @change="$emit('input', $event)")
</template>

<script lang="ts">
import Vue from 'vue'
import anydown from './Anydown'

export default Vue.extend({
  name: 'Anydown',
  components: {
    anydown
  },
  props: {
    value: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="stylus">
.markdown-body li>p
  margin-top: unset !important
  margin-bottom: .25em
</style>

<style src="github-markdown-css/github-markdown.css">
