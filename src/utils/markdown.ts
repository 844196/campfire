import unified from 'unified'
import markdownParser from 'remark-parse'
import visit from 'unist-util-visit'
import { Heading } from 'mdast'
import toString from 'mdast-util-to-string'
import { trim } from 'lodash'

const parser = unified().use(markdownParser)

function toMNode (value: string) {
  return parser.parse(value)
}

export function parseTitle (src: string, defaultTitle: string): string {
  let title = defaultTitle
  visit(toMNode(src), 'heading', (node: Heading) => {
    const trimed = trim(toString(node))
    if (trimed.length === 0) {
      return
    }
    title = trimed
    return false
  })
  return title
}
