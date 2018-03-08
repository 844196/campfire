<template lang="pug">
md-snackbar(:md-position="options.position", :md-duration="options.duration", :md-active.sync="visible")
  span {{ message }}
  md-button.md-primary(@click="visible = false") Close
</template>

<script lang="ts">
import Vue from 'vue'
import { mapSnackbarState, mapSnackbarMutations } from '@/store/snackbar'

export default Vue.extend({
  name: 'Snackbar',
  computed: {
    ...mapSnackbarState(['message', 'options']),
    ...mapSnackbarState({ visibility: 'visible' }),
    visible: {
      get (): boolean {
        return this.visibility
      },
      set (value: boolean): void {
        this.changeVisibility(value)
      }
    }
  },
  methods: {
    ...mapSnackbarMutations(['changeVisibility'])
  }
})
</script>
