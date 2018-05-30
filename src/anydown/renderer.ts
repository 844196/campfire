import Vue, { VNode } from 'vue'
import { Compiler, Parser, Reflector } from './types'

export default function install (parse: Parser, compile: Compiler) {
  return Vue.extend({
    name: 'AnydownRenderer',
    props: {
      value: {
        type: String,
        required: true
      }
    },
    methods: {
      onInput (reflect: Reflector) {
        this.$emit('input', reflect(this.value))
      }
    },
    render (h): VNode {
      return compile(parse(this.value), h, this.onInput)
    }
  })
}
