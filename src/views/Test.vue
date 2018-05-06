<template lang="pug">
div
  textarea(v-model="value")
  render(:value="value")
</template>

<script lang="ts">
import Vue from 'vue'
import * as Render from '@/components/atoms/AnydownRender.vue'
import * as UMLComponent from '@/components/atoms/AnydownPlantUML.vue'
import * as TestComponent from '@/components/atoms/AnydownTest.vue'

const render = Render.Install({
  components: [UMLComponent, TestComponent]
})

export default Vue.extend({
  name: 'Test',
  components: {
    render
  },
  data () {
    return {
      value: '* foo\n* bar\n'
    }
  }
})
</script>
