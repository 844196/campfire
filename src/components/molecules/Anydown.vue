<template lang="pug">
renderer.markdown-body(:value="value", @input="$emit('input', $event)")
</template>

<script lang="ts">
import Vue from 'vue'
import { Installer as RendererInstaller } from '@/anydown'
import PlantUMLComponent from '@/components/atoms/AnydownPlantUML.vue'
import TestComponent from '@/components/atoms/AnydownTest.vue'

const renderer = new RendererInstaller()
  .addAnydownComponent('uml', PlantUMLComponent)
  .addAnydownComponent('test', TestComponent)
  .install()

export default Vue.extend({
  name: 'Anydown',
  components: {
    renderer
  },
  props: {
    value: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="stylus" scoped>
.markdown-body .task-list-item input
  vertical-align: unset
</style>

<style src="github-markdown-css/github-markdown.css">
