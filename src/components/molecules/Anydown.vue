<template lang="pug">
render.markdown-body(:uuid="uuid.toString()", :value="value", @input="onInput")
</template>

<script lang="ts">
import Vue from 'vue'
import install from '@/anydown'
import UUID from '@/utils/uuid'

const render = install([
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
  },
  methods: {
    onInput (value: string) {
      this.$emit('input', value)
    }
  }
})
</script>

<style src="github-markdown-css/github-markdown.css">
