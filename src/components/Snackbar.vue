<template lang="pug">
md-snackbar(:md-position="options.position", :md-duration="options.duration", :md-active.sync="visibility")
  span {{ message }}
</template>

<script lang="ts">
import Vue from 'vue'
import { snackbarHelpers } from '@/store/snackbar'

export default Vue.extend({
  name: 'Snackbar',
  computed: {
    ...snackbarHelpers.mapState(['message', 'options', 'visible']),
    visibility: {
      get (): boolean {
        return this.visible
      },
      set (value: boolean): void {
        this.changeVisibility(value)
      }
    }
  },
  methods: snackbarHelpers.mapMutations(['changeVisibility'])
})
</script>
