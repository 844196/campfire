<template lang="pug">
md-snackbar(:md-position="options.position", :md-duration="options.duration", :md-active.sync="visibility")
  span {{ message }}
</template>

<script lang="ts">
import Vue from 'vue'
import { mapSnackbarState, mapSnackbarMutations } from '@/store/snackbar'

export default Vue.extend({
  name: 'Snackbar',
  computed: {
    ...mapSnackbarState(['message', 'options', 'visible']),
    visibility: {
      get (): boolean {
        return this.visible
      },
      set (value: boolean): void {
        this.changeVisibility(value)
      }
    }
  },
  methods: mapSnackbarMutations(['changeVisibility'])
})
</script>
