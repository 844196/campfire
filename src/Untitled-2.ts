const src = 'foo\nbar\nhoge\nfuga\n'

type LineInfo = {
  position: {
    Ln: number
    BoL: number
    EoL: number
  },
  content: string
}

let idxFromBoS = 0
const map = src.split('\n').map<LineInfo>((line, idx, self) => {
  if (self.length === 1) {
    return {
      position: {
        Ln: 0,
        BoL: 0,
        EoL: line.length
      },
      content: line
    }
  }

  const li = {
    position: {
      Ln: idx,
      BoL: idxFromBoS,
      EoL: idxFromBoS + line.length
    },
    content: line
  }

  idxFromBoS += line.length + (1 /* 改行文字分 */)

  return li
})

console.log(map)
console.log(JSON.stringify(src.slice(0, 3)))
