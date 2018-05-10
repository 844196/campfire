<template lang="pug">
textarea.memo-editor-textarea(:value="value", @input="$emit('input', $event.target.value)")
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'MemoEditorTextarea',
  props: {
    value: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="stylus" scoped>
.memo-editor-textarea
  font-family: Consolas,Liberation Mono,Menlo,Courier,monospace
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  border: 0
  resize: none
  &:focus
    outline: none !important
</style>
