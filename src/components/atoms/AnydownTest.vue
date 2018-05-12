<template lang="pug">
textarea(:value="value", @input="$emit('input', $event.target.value)")
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
  }
})
</script>
