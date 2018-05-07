<template lang="pug">
render(v-model="value", @input="onInput")
</template>

<script lang="ts">
import Vue from 'vue'
import { Install } from '@/components/atoms/AnydownRender.vue'
import * as UMLComponent from '@/components/atoms/AnydownPlantUML.vue'
import * as TestComponent from '@/components/atoms/AnydownTest.vue'

const render = Install({
  components: [
    UMLComponent,
    TestComponent
  ]
})

export default Vue.extend({
  name: 'Anydown',
  components: {
    render
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  methods: {
    onInput () {
    }
  }
})
</script>
