<template lang="pug">
pre(class="pretty-code hljs")
  code(v-html="highlighted")
</template>

<script lang="ts">
import Vue from 'vue'
import hljs from 'highlight.js'

export default Vue.extend({
  props: {
    value: {
      type: String,
      required: true
    },
    language: {
      type: String,
      required: true
    }
  },
  computed: {
    canHighlight (): boolean {
      return hljs.getLanguage(this.language) !== undefined
    },
    highlighted (): string {
      return this.canHighlight ? hljs.highlight(this.language, this.value).value : this.value
    }
  }
})
</script>

<style lang="css">
/**
 * ltz_code style (c) liangtongzhuo <liangtongzhuo@gmail.com>
 * origin: https://github.com/liangtongzhuo/highlight_code/blob/master/ltz_code.css
 */

.hljs {
  background: #f8f8f8 !important;
  color: #525252 !important;
}

.hljs-comment,
.hljs-quote {
  color: #717171;
}

.hljs-keyword,
.hljs-selector-tag,
.hljs-literal {
  color: #e96900;
}

.hljs-name {
  color: #2973b7;
}

.hljs-variable,
.hljs-template-variable {
  color: #660;
}

.hljs-string {
  color: #42b983;
}

.hljs-regexp,
.hljs-link {
  color: #080;
}

.hljs-title,
.hljs-tag,
.hljs-symbol,
.hljs-bullet,
.hljs-number,
.hljs-meta {
  color: #2973b7;
}

.hljs-section,
.hljs-class .hljs-title,
.hljs-type,
.hljs-attr,
.hljs-built_in,
.hljs-builtin-name,
.hljs-params {
  color: #2973b7;
}

.hljs-attribute,
.hljs-subst {
  color: #000;
}

.hljs-formula {
  background-color: #eee;
  font-style: italic;
}

.hljs-addition {
  background-color: #baeeba;
}

.hljs-deletion {
  background-color: #ffc8bd;
}

.hljs-selector-id,
.hljs-selector-class {
  color: #9b703f;
}

.hljs-doctag,
.hljs-strong {
  font-weight: bold;
}

.hljs-emphasis {
  font-style: italic;
}
</style>
