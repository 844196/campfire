<template lang="pug">
img(:src="src")
</template>

<script lang="ts">
import Vue from 'vue'
import PlantUML from 'plantuml-encoder'
import { throttle } from 'lodash'

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
  computed: {
    decodedUrl (): string {
      return `http://www.plantuml.com/plantuml/svg/${PlantUML.encode(this.value)}`
    }
  },
  created () {
    this.updateSrc()
    this.$watch('value', throttle(this.updateSrc, 800, {
      leading: false,
      trailing: true
    }))
  },
  methods: {
    updateSrc () {
      this.src = this.decodedUrl
    }
  }
})
</script>
