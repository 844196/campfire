import { Code as Codeblock } from 'mdast'
import { Parent, Position } from 'unist'
import { Component } from 'vue'
import { Mutator, TupledMiddleware } from './types'

function parseBlock (block: Array<string>) {
  const openFence = block[0]
  const closeFence = block[block.length - 1]

  const openFenceIdx = openFence.search(/[~`]/)
  const fence = openFence.substr(openFenceIdx, 3)
  const indent = openFence.slice(0, openFenceIdx)
  const isFenceClosed = closeFence.trim() === fence

  return { openFence, closeFence, fence, indent, isFenceClosed }
}

function reflectToCodeBlock (value: string, position: Position): Mutator {
  return src => {
    // FIXME: Unist.PositionをMarkdownItのmapに無理やり合わせている
    const start = position.start.line - 1
    const end = position.end.line

    let splited = src.split('\n')

    const block = splited.slice(start, end)
    const { fence, indent, isFenceClosed } = parseBlock(block)

    let spliceAmount: number
    if (isFenceClosed) {
      spliceAmount = block.length - 2
    } else {
      // 操作を統一させるため、閉じフェンスを挿入する
      splited.splice(
        start + 1,
        // 開きフェンスの直後に別のノードが存在するか
        // e.g. リスト内にインデントで記述されたフェンス
        end - start === 1 ? 0 : end - start,
        ...[indent, `${indent}${fence}`]
      )
      spliceAmount = 1
    }

    splited.splice(
      start + 1,
      spliceAmount,
      ...value.split('\n').map(line => `${indent}${line}`)
    )

    return splited.join('\n')
  }
}

export type NodeMatcher = (node: Codeblock, parent?: Parent) => boolean

export function customCodeblock (
  lang: string | Array<string> | NodeMatcher,
  component: Component<any, any, any, any>
): TupledMiddleware<Codeblock> {
  return ['code', ({ h, commit }, node, parent) => {
    if (typeof lang === 'string') {
      if (node.lang !== lang) {
        return
      }
    } else if (lang instanceof Array) {
      if (node.lang === null || !lang.includes(node.lang)) {
        return
      }
    } else {
      if (!lang(node, parent)) {
        return
      }
    }
    return h(component, {
      on: {
        input: (value: string) => commit(reflectToCodeBlock(value, node.position!))
      },
      props: {
        value: node.value,
        info: node.lang === null ? '' : node.lang
      }
    })
  }]
}
