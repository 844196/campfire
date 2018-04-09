import uuidv4 from 'uuid/v4'
import isUUID from 'is-uuid'

export default class UUID {
  // eslint-disable-next-line no-useless-constructor
  private constructor (readonly value: string) {}

  toString (): string {
    return this.value
  }

  isEqual (other: UUID): boolean {
    return other.value === this.value
  }

  static valueOf (raw: string): UUID {
    if (!isUUID.v4(raw)) {
      throw new Error('invalid value')
    }
    return new this(raw)
  }

  static generate (): UUID {
    return this.valueOf(uuidv4())
  }
}
