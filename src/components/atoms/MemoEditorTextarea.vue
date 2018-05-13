<template lang="pug">
codemirror.memo-editor-textarea(:value="value", :options="options", @change="$emit('input', $event)")
</template>

<script lang="ts">
import Vue from 'vue'
import { codemirror } from 'vue-codemirror-lite'
import { EditorConfiguration } from 'codemirror'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/lib/codemirror.css'

// eslint-disable-next-line space-infix-ops
const options: EditorConfiguration = {
  mode: {
    name: 'text/x-markdown',
    highlightFormatting: true
  },
  tabSize: 2,
  indentUnit: 2,
  indentWithTabs: false,
  scrollbarStyle: 'null',
  lineWrapping: true,
  theme: 'custom',
  extraKeys: {
    Tab: 'indentMore',
    'Shift-Tab': 'indentLess'
  }
}

export default Vue.extend({
  name: 'MemoEditorTextarea',
  components: {
    codemirror
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      options
    }
  }
})
</script>

<style lang="stylus" scoped>
.memo-editor-textarea
  & >>> .CodeMirror
    height: unset
    font-family: "SFMono-Regular",Consolas,"Liberation Mono",Menlo,Courier,monospace
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale

    .cm-header
      color: #005cc5
    .cm-comment
      color: #6a737d
    .cm-link
      color: #005cc5
    .cm-formatting-link.cm-link, .cm-formatting-image.cm-link
      color: unset
      text-decoration: none
    .cm-formatting-list
      color: #e36209
    .cm-formatting-quote.cm-quote
      color: #005cc5
    .cm-quote
      color: #6a737d
    .cm-formatting-code-block
      color: #6a737d
    .cm-formatting-code
      color: #005cc5
    .cm-formatting-code + .cm-comment
      color: #005cc5
</style>
