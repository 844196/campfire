<template lang="pug">
codemirror.memo-editor-textarea(ref="codemirror", :value="value", :options="options", @change="onInput", @click.native="onClick")
</template>

<script lang="ts">
import Vue from 'vue'
import { codemirror } from 'vue-codemirror-lite'
// eslint-disable-next-line space-infix-ops
import { Editor, EditorConfiguration } from 'codemirror'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/edit/trailingspace.js'

const options: EditorConfiguration & { showTrailingSpace: boolean } = {
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
  },
  showTrailingSpace: true
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
  },
  methods: {
    onInput (value: string) {
      this.$emit('input', value)
    },
    onClick () {
      const cm = (this.$refs.codemirror as Vue & { editor: Editor }).editor
      if (cm.hasFocus()) {
        return
      }

      const doc = cm.getDoc()
      const line = doc.lastLine()
      const ch = doc.getLine(line).length

      doc.setCursor({ line, ch })
      cm.focus()
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
      text-decoration: none
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
    [class*="cm-trailingspace"]
      border-bottom: 1px solid red
</style>
