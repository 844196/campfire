import { MarkdownIt, Token, TokenRender } from 'markdown-it'
import PlantUMLEncoder from 'plantuml-encoder'
import { sha256 } from '@/utils/hash'

function isPlantUMLFence (t: Token): boolean {
  const lang = t.info.trim().split(/\s+/g)[0]
  return (lang === 'plantuml') || (lang === 'uml')
}

export interface CachePlantUMLPool extends Map<string, string> {}

export class PlantUML {
  private _hash?: string
  private _encoded?: string

  // eslint-disable-next-line no-useless-constructor
  constructor (readonly content: string) {}

  get hash (): string {
    if (!this._hash) {
      this._hash = sha256(this.content)
    }
    return this._hash
  }

  encode (): string {
    if (!this._encoded) {
      this._encoded = PlantUMLEncoder.encode(this.content)
    }
    return this._encoded
  }
}

export type PlantUMLReplaceOrder = {
  replaceFrom: string
  replaceTo: string
}

export interface PlantUMLRendererEnv {
  processedPlantUMLs: Map<string, PlantUML>
  plantUMLReplaceOrders: Array<PlantUMLReplaceOrder>
}

export interface Options {
  imgApiUrl?: string
}

export default function markdownitPlantUML (md: MarkdownIt, cachePool: CachePlantUMLPool, options?: Options) {
  const codeFenceRenderer = md.renderer.rules.fence

  const IMG_API_URL = (options && options.imgApiUrl) ? options.imgApiUrl : 'http://www.plantuml.com/plantuml/svg/'
  const src = (encoded: string) => `${IMG_API_URL}${encoded}`

  const plantUMLRenderer: TokenRender = function (tokens, index, _, env: PlantUMLRendererEnv, __): string {
    const content = tokens[index].content
    if (content.trim().length === 0) {
      return ''
    }

    const uml = new PlantUML(content)
    env.processedPlantUMLs.set(uml.hash, uml)

    const cached = cachePool.get(uml.hash)
    if (cached) {
      return `<img src="${src(cached)}">`
    }

    const replaceFrom = `<img data-src="${src(uml.encode())}">`
    const replaceTo = `<img src="${src(uml.encode())}">`

    env.plantUMLReplaceOrders.push({ replaceFrom, replaceTo })
    cachePool.set(uml.hash, uml.encode())

    return replaceFrom
  }

  md.renderer.rules.fence = function (tokens, index, options, env, self) {
    const renderer = isPlantUMLFence(tokens[index]) ? plantUMLRenderer : codeFenceRenderer
    return renderer(tokens, index, options, env, self)
  }
}
