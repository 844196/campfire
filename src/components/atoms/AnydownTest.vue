<template lang="pug">
textarea(:value="value", @input="onInput($event.target.value)")
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AnydownTest',
  props: {
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
