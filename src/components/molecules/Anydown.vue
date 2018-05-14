<template lang="pug">
render.markdown-body(:uuid="uuid.toString()", :value="value", @input="$emit('input', $event)")
</template>

<script lang="ts">
import Vue from 'vue'
import install from '@/anydown'
import UUID from '@/utils/uuid'
import MarkdownIt from 'markdown-it'
import linkAttributes from 'markdown-it-link-attributes'

const md = new MarkdownIt()
  .use(linkAttributes, {
    attrs: {
      target: '_blank'
    }
  })

const render = install(md, [
  {
    lang: 'uml',
    component: require('@/components/atoms/AnydownPlantUML.vue').default
  },
  {
    lang: 'test',
    component: require('@/components/atoms/AnydownTest.vue').default
  }
])

export default Vue.extend({
  name: 'Anydown',
  components: {
    render
  },
  props: {
    uuid: {
      type: Object as () => UUID,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }
})
</script>

<style src="github-markdown-css/github-markdown.css">
