import JsSHA from 'jssha'

export function sha256 (text: string): string {
  const s = new JsSHA('SHA-256', 'TEXT')
  s.update(text)
  return s.getHash('HEX')
}
