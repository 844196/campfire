import UUID from '@/utils/uuid'

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
  // eslint-disable-next-line no-useless-constructor
  private constructor (
    public uuid: UUID,
    public authorUid: string,
    public content: string,
    public updatedAt: Date
  ) {}

  get title (): string {
    // FIXME
    return 'Untitled'
  }

  deflate (): RawMemo {
    return {
      uuid: this.uuid.toString(),
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
    return new this(UUID.valueOf(uuid), authorUid, content, new Date(updatedAt))
  }

  static empty (uuid: UUID, authorUid: string): Memo {
    return new this(uuid, authorUid, '', new Date())
  }
}
