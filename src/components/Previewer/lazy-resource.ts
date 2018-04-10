export interface LazyResource {
  type: string
  index: number
  hash: string
  uri: string
  toCache (): LazyResourceCache
}

export interface LazyResourceCache {
  hash: string
  uri: string
}

export interface LazyResourceCacheStore {
  get (type: string, index: number): LazyResourceCache | undefined
  set (type: string, index: number, value: LazyResourceCache): void
  del (type: string, index: number): void
}
