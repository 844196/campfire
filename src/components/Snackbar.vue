<template lang="pug">
md-snackbar(:md-position="position", :md-duration="duration", :md-active.sync="visible")
  span {{ message }}
  md-button.md-primary(@click="visible = false") Close
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'Snackbar',
  computed: {
    ...mapState('snackbar', [
      'message',
      'position',
      'duration'
    ]),
    visible: {
      get () {
        return this.$store.state.snackbar.visible
      },
      set (value) {
        this.$store.commit('snackbar/changeVisibility', value)
      }
    }
  }
})
</script>
