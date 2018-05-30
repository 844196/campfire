<template lang="pug">
router-view
</template>

<script>
import Vue from 'vue'
import 'normalize.css/normalize.css'
import FeatherIcons from 'vue-icon'
import Timeago from 'vue-timeago'
import Toasted from 'vue-toasted'

Vue.use(FeatherIcons, 'v-icon')
Vue.use(Timeago, {
  name: 'timeago',
  locale: 'ja',
  locales: {
    'ja': require('date-fns/locale/ja')
  }
})
Vue.use(Toasted, {
  duration: 1500,
  position: 'bottom-center',
  iconPack: 'material'
})

export default Vue.extend({
  name: 'App'
})
</script>

<style lang="stylus">
*
  box-sizing: border-box
.icon
  width: 24px
.toasted-container.bottom-center
  bottom: 1em
.toasted-container.top-right
  top: 5px
  right: 15px
</style>
