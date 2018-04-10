import { Token, Renderer } from 'markdown-it'
import { sha256 } from '@/utils/hash'
import UMLEncoder from 'plantuml-encoder'
import { LazyResource, LazyResourceCacheStore, LazyResourceCache } from './lazy-resource'
import { LazyReplaceOrder } from './lazy-replacer'

export function isUMLFence (token: Token): boolean {
  const lang = token.info.trim().split(/\s+/g)[0]
  return (lang === 'uml') || (lang === 'plantuml')
}

export class UML implements LazyResource {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    readonly index: number,
    readonly content: string
  ) {}

  get type (): string {
    return 'uml'
  }

  get hash (): string {
    return sha256(this.content)
  }

  get uri (): string {
    return `http://www.plantuml.com/plantuml/svg/${UMLEncoder.encode(this.content)}`
  }

  toCache (): LazyResourceCache {
    return { hash: this.hash, uri: this.uri }
  }
}

interface RendererEnv {
  cacheStore: LazyResourceCacheStore
  replaceOrders: Array<LazyReplaceOrder>
}

export function umlRenderer (
  allTokens: Token[],
  idx: number,
  _: any,
  { cacheStore, replaceOrders }: RendererEnv,
  __: Renderer
): string | void {
  const token = allTokens[idx]
  const resourceIdx = allTokens.filter(isUMLFence).findIndex(t => t === token)
  const content = token.content

  const resource = new UML(resourceIdx, content)

  if (resource.content.replace('\n', '').replace(/^`+$/, '') === '') {
    // 中身が空
    cacheStore.del(resource.type, resource.index)
    return ''
  }

  const cache = cacheStore.get(resource.type, resource.index)
  if (cache && resource.hash === cache.hash) {
    // 2回目以降、かつ、前回から変更なし
    return `<img src="${cache.uri}">`
  }

  // * 1回目
  // * 2回目以降、かつ、前回から変更あり
  const replaceFrom = cache
    ? `<img src="${cache.uri}" data-new-hash="${resource.hash}">`
    : `<span data-new-hash="${resource.uri}"></span>`
  const replaceTo = `<img src="${resource.uri}">`
  replaceOrders.push(new LazyReplaceOrder(resource, replaceFrom, replaceTo))

  return replaceFrom
}
