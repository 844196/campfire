import Vue, { VNode } from 'vue'
import { parse } from './parser'
import { Compiler, Mutator } from './types'

export function installRenderer (compiler: Compiler) {
  return Vue.extend({
    name: 'AnydownRenderer',
    model: {
      prop: 'src',
      event: 'change'
    },
    props: {
      src: {
        type: String,
        required: true
      }
    },
    methods: {
      commitMutation (mutator: Mutator) {
        this.$emit('change', mutator(this.src))
      }
    },
    render (h): VNode {
      return compiler.compile(parse(this.src), h, this.commitMutation)
    }
  })
}
