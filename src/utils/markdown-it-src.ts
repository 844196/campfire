import MarkdownIt from 'markdown-it'

export interface RenderEnv {
  src: string
}

export default function MarkdownItSrc (md: MarkdownIt.MarkdownIt) {
  const originFn = md.render
  md.render = function (src, originEnv) {
    let env: RenderEnv = originEnv || {}
    env['src'] = src
    return originFn.call(this, src, env)
  }
}
