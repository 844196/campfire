import { Root as MNodeRoot } from 'mdast'
import Vue, { CreateElement, VNode } from 'vue'

export type InputHandler = (reflect: Reflector) => void
export type Parser = (src: string) => MNodeRoot
export type Compiler = (mnodeRoot: MNodeRoot, h: CreateElement, onInput: InputHandler) => VNode
export type Reflector = (src: string) => string

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
