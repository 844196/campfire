<template lang="pug">
router-view
</template>

<script>
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'normalize.css/normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
import FeatherIcons from 'vue-icon'
import Timeago from 'vue-timeago'

Vue.use(ElementUI)
Vue.use(FeatherIcons, 'v-icon')
Vue.use(Timeago, {
  name: 'timeago',
  locale: 'ja',
  locales: {
    'ja': require('date-fns/locale/ja')
  }
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
</style>
