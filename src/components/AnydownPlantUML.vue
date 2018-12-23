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
  watch: {
    // vue-routerを使用している場合、遷移先にもこのコンポーネントがあると再利用される
    // その際ライフサイクルイベント (created) が発火しないため、古い内容が800ms表示され続ける
    // これを回避するため、ページ遷移時に強制的に src を更新する
    '$route' () {
      this.updateSrc()
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
      this.src = `http://www.plantuml.com/plantuml/svg/${PlantUML.encode(this.value)}`
    }
  }
})
</script>
