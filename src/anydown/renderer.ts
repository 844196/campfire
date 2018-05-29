import { Root as MNodeRoot } from 'mdast'
import { Position } from 'unist'
import Vue, { CreateElement, VNode } from 'vue'

export type InputHandler = (value: string, position: Position) => void
export type Parser = (src: string) => MNodeRoot
export type Compiler = (mnodeRoot: MNodeRoot, h: CreateElement, onInput: InputHandler) => VNode
export type Reflector = (src: string, value: string, position: Position) => string

export default function install (parse: Parser, compile: Compiler, reflect: Reflector) {
  return Vue.extend({
    name: 'AnydownRenderer',
    props: {
      value: {
        type: String,
        required: true
      }
    },
    methods: {
      onInput (value: string, position: Position) {
        this.$emit('input', reflect(this.value, value, position))
      }
    },
    render (h): VNode {
      return compile(parse(this.value), h, this.onInput)
    }
  })
}
