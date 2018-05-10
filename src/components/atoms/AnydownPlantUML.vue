<template lang="pug">
component(:is="tag", :src="src")
</template>

<script lang="ts">
import Vue from 'vue'
import PlantUML from 'plantuml-encoder'
import { debounce } from 'lodash'

export default Vue.extend({
  name: 'AnydownPlantUML',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      tag: 'span',
      src: ''
    }
  },
  watch: {
    value: {
      handler: debounce(function (this: any) {
        this.tag = 'img'
        this.src = `http://www.plantuml.com/plantuml/svg/${PlantUML.encode(this.value)}`
      }, 1000, { leading: false, trailing: true }),
      immediate: true
    }
  }
})
</script>
