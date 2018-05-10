function parseBlock (block: Array<string>) {
  const openFence = block[0]
  const closeFence = block[block.length - 1]

  const openFenceIdx = openFence.search(/[~`]/)
  const fence = openFence.substr(openFenceIdx, 3)
  const indent = openFence.slice(0, openFenceIdx)

  const isFenceClosed = closeFence.trim() === fence

  return { openFence, closeFence, fence, indent, isFenceClosed }
}

export default function reflect (src: string, value: string, [start, end]: [number, number]): string {
  let splited = src.split('\n')

  const block = splited.slice(start, end)
  const { fence, indent, isFenceClosed } = parseBlock(block)

  let spliceAmount: number
  if (isFenceClosed) {
    spliceAmount = block.length - 2
  } else {
    // 操作を統一させるため、閉じフェンスを挿入する
    splited.splice(
      start + 1,
      // 開きフェンスの直後に別のノードが存在するか
      // e.g. リスト内にインデントで記述されたフェンス
      end - start === 1 ? 0 : end - start,
      ...[indent, `${indent}${fence}`]
    )
    spliceAmount = 1
  }

  splited.splice(
    start + 1,
    spliceAmount,
    ...value.split('\n').map(line => `${indent}${line}`)
  )

  return splited.join('\n')
}
