<template lang="pug">
img(:src="src")
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
      src: ''
    }
  },
  watch: {
    value: debounce(function (this: any) {
      this.src = `http://www.plantuml.com/plantuml/svg/${PlantUML.encode(this.value)}`
    }, 1000, { leading: false, trailing: true })
  },
  created () {
    this.src = `http://www.plantuml.com/plantuml/svg/${PlantUML.encode(this.value)}`
  }
})
</script>
