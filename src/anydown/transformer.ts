import MarkdownIt from 'markdown-it'

interface Options {
  lang: string
  eleName: string
}

export default function (md: MarkdownIt.MarkdownIt, { lang, eleName }: Options) {
  const origin = md.renderer.rules.fence

  md.renderer.rules.fence = (tokens, index, options, env, self) => {
    const token = tokens[index]

    if (token.info !== lang) {
      return origin(tokens, index, options, env, self)
    }

    return `<${eleName}
      :value='${JSON.stringify(token.content.trim())}'
      @input='onInput($event.trim(), ${JSON.stringify(token.map)})'
    />`
  }
}
