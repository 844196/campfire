export interface RawMemo {
  memoUid: string
  authorUid: string
  title: string
  content: string
  updatedAt: string
}

export class Memo {
  // eslint-disable-next-line no-useless-constructor
  private constructor (
    readonly memoUid: string,
    readonly authorUid: string,
    readonly title: string,
    readonly content: string,
    readonly updatedAt: string
  ) {}

  deflate (): RawMemo {
    return {
      memoUid: this.memoUid,
      authorUid: this.authorUid,
      title: this.title,
      content: this.content,
      updatedAt: this.updatedAt
    }
  }

  static inflate ({ memoUid, authorUid, title, content, updatedAt }: RawMemo): Memo {
    return new this(memoUid, authorUid, title, content, updatedAt)
  }

  static empty (memoUid: string, authorUid: string): Memo {
    return new this(memoUid, authorUid, '', '', new Date().toISOString())
  }
}
