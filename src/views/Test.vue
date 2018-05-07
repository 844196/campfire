<template lang="pug">
div
  textarea(v-model="value")
  anydown(v-model="value")
</template>

<script lang="ts">
import Vue from 'vue'
import Anydown from '@/components/molecules/Anydown.vue'

export default Vue.extend({
  name: 'Test',
  components: {
    Anydown
  },
  data () {
    return {
      value: ''
    }
  }
})
</script>
