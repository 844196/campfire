import JsSHA from 'jssha'

export function sha256 (text) {
  const s = new JsSHA('SHA-256', 'TEXT')
  s.update(text)
  return s.getHash('HEX')
}
