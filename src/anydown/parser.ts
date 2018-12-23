import { Root as MNodeRoot } from 'mdast'
import remarkParser from 'remark-parse'
import unified from 'unified'

const remark = unified().use(remarkParser)

export function parse (src: string) {
  return remark.parse(src) as MNodeRoot
}
