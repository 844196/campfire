import uuidv4 from 'uuid/v4'
import isUUID from 'is-uuid'

export function generate (): string {
  return uuidv4()
}

export function isValid (uuid: string): boolean {
  return isUUID.v4(uuid)
}

export function ensureValid (uuid: string): string {
  if (isValid(uuid)) {
    return uuid
  }
  throw new Error('Invalid uuid value')
}
