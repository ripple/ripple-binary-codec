import type BinaryParser from '../serdes/BinaryParser'

import Bytes from './Bytes'

// @brief: Collection of Bytes objects, mapping bidirectionally
export default class BytesLookup {
  private readonly _ordinalWidth: number

  public constructor(types: Record<string, number>, ordinalWidth: number) {
    this._ordinalWidth = ordinalWidth
    Object.entries(types).forEach(([key, value]) => {
      const bytesValue = new Bytes(key, value, this._ordinalWidth)
      this[key] = bytesValue
      this[value.toString()] = bytesValue
    })
  }

  public from(value: Bytes | string): Bytes {
    /* eslint-disable @typescript-eslint/consistent-type-assertions --
     * TODO we can fix this by storing the lookup as an object on this class,
     * see FieldLookup */
    return value instanceof Bytes ? value : (this[value] as Bytes)
    /* eslint-enable @typescript-eslint/consistent-type-assertions */
  }

  public fromParser(parser: BinaryParser): Bytes {
    return this.from(parser.readUIntN(this._ordinalWidth).toString())
  }
}
