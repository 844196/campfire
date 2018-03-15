import MarkdownIt from 'markdown-it'
const md = new MarkdownIt()

export interface RawMemo {
  memoUid: string
  authorUid: string
  content: string
  updatedAt: string
}

export class Memo {
  // eslint-disable-next-line no-useless-constructor
  private constructor (
    readonly memoUid: string,
    readonly authorUid: string,
    readonly content: string,
    readonly updatedAt: string
  ) {}

  get title (): string {
    const dom = document.createElement('div')
    dom.innerHTML = md.render(this.content)

    const title = Array.from(dom.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      .map(ele => ele.textContent)
      .find(txt => txt !== '') || 'Untitled'

    return title
  }

  deflate (): RawMemo {
    return {
      memoUid: this.memoUid,
      authorUid: this.authorUid,
      content: this.content,
      updatedAt: this.updatedAt
    }
  }

  static inflate ({ memoUid, authorUid, content, updatedAt }: RawMemo): Memo {
    return new this(memoUid, authorUid, content, updatedAt)
  }

  static empty (memoUid: string, authorUid: string): Memo {
    return new this(memoUid, authorUid, '', new Date().toISOString())
  }
}
