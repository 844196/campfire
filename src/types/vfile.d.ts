declare module 'vfile' {
  import VMessage from 'vfile-message'

  declare const v: VFile<{}>
  export = v

  type Contents = string | Buffer

  interface VFileParamsBase<T> {
    data?: T
    contents?: Contents
    path?: string
    basename?: string
    extname?: string
    dirname?: string
    cwd?: string
  }

  type VFileParams<T extends { data?: {} }> = VFileParamsBase<T['data']> & T

  interface VFileBase<T extends { data?: {} }> {
    (value?: Contents): VFile<T>
    <T>(value?: VFile<T> | VFileParams<T>): VFile<T>

    contents: Contents
    data: T['data']
    cwd: string
    path?: string
    basename?: string
    stem?: string
    extname?: string
    dirname?: string
    history: Array<string>
    messages: Array<VMessage>

    toString (encoding?: BufferEncoding): string
  }

  type VFile<T> = VFileBase<T> & T
}
