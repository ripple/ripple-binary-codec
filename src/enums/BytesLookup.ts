import type BinaryParser from '../serdes/BinaryParser'

import Bytes from './Bytes'

/*
 * @brief: Collection of Bytes objects, mapping bidirectionally
 */
export default class BytesLookup {
  constructor(types: Record<string, number>, readonly ordinalWidth: number) {
    Object.entries(types).forEach(([key, value]) => {
      this[key] = new Bytes(key, value, ordinalWidth)
      this[value.toString()] = this[key] as Bytes
    })
  }

  from(value: Bytes | string): Bytes {
    return value instanceof Bytes ? value : (this[value] as Bytes)
  }

  fromParser(parser: BinaryParser): Bytes {
    return this.from(parser.readUIntN(this.ordinalWidth).toString())
  }
}
