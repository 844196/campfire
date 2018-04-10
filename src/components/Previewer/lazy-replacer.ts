import { LazyResource, LazyResourceCacheStore } from './lazy-resource'

export class LazyReplaceOrder {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    readonly resource: LazyResource,
    readonly replaceFrom: string,
    readonly replaceTo: string
  ) {}
}

export function lazyReplacer (
  content: string,
  order: LazyReplaceOrder,
  cacheStore?: LazyResourceCacheStore
): string {
  if (cacheStore) {
    cacheStore.set(order.resource.type, order.resource.index, order.resource.toCache())
  }
  return content.replace(order.replaceFrom, order.replaceTo)
}
