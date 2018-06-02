import { ensureValid } from '@/utils/uuid'
import { parseTitle } from '@/utils/markdown'

/**
 * 型付けされた生のメモ
 */
export interface RawMemo {
  uuid: string
  authorUid: string
  content: string
  updatedAt: string
}

/**
 * メモエンティティ
 */
export default class Memo {
  private constructor (
    public uuid: string,
    public authorUid: string,
    public content: string,
    public updatedAt: Date
  ) {}

  get title (): string {
    return parseTitle(this.content, 'Untitled')
  }

  deflate (): RawMemo {
    return {
      uuid: this.uuid,
      authorUid: this.authorUid,
      content: this.content,
      updatedAt: this.updatedAt.toString()
    }
  }

  deflateForPersist (now: Date): RawMemo {
    let raw = this.deflate()
    raw.updatedAt = now.toISOString()
    return raw
  }

  static inflate ({ uuid, authorUid, content, updatedAt }: RawMemo): Memo {
    return new this(ensureValid(uuid), authorUid, content, new Date(updatedAt))
  }

  static empty (uuid: string, authorUid: string): Memo {
    return new this(ensureValid(uuid), authorUid, '', new Date())
  }
}
