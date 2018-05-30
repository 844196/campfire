import remarkParser from 'remark-parse'
import unified from 'unified'
import { MNodeRoot } from './types'

export default function install () {
  const parser = unified().use(remarkParser)

  return function (src: string) {
    return parser.parse(src) as MNodeRoot
  }
}
