import MarkdownIt, { TokenRender } from 'markdown-it'

type LangDetector = (lang: string) => boolean

type Config = {
  lang: string | Array<string> | LangDetector
  render: TokenRender
}

export default function customFence ({ lang, render }: Config): (md: MarkdownIt.MarkdownIt) => void {
  let isTargetLang: LangDetector
  if (typeof lang === 'string') {
    isTargetLang = (l: string) => lang === l
  } else if (lang instanceof Array) {
    isTargetLang = (l: string) => lang.includes(l)
  } else {
    isTargetLang = lang
  }

  return function (md) {
    const originRender = md.renderer.rules.fence
    md.renderer.rules.fence = function (tokens, index, options, env, self) {
      const l = tokens[index].info.trim().split(/\s+/g)[0]
      const r = isTargetLang(l) ? render : originRender
      return r(tokens, index, options, env, self)
    }
  }
}
