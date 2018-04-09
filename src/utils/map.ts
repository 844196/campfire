/**
 * { k1: { k2: v } } なマップ
 */
export class LooseMap2<T> {
  private container = new Map<any, Map<any, T>>()

  get (k1: any, k2: any): T | undefined {
    if (!this.container.has(k1)) {
      return undefined
    }
    return this.container.get(k1)!.get(k2)
  }

  set (k1: any, k2: any, value: T): void {
    if (!this.container.has(k1)) {
      this.container.set(k1, new Map<any, T>())
    }
    this.container.get(k1)!.set(k2, value)
  }

  del (k1: any, k2: any): void {
    if (!this.container.has(k1)) {
      return
    }
    this.container.get(k1)!.delete(k2)
  }

  delAll (): void {
    this.container = new Map<any, Map<any, T>>()
  }
}
