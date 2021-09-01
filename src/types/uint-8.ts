import { Buffer } from 'buffer/'

import type BinaryParser from '../serdes/BinaryParser'

import UInt from './uint'

/**
 * Derived UInt class for serializing/deserializing 8 bit UInt.
 */
export default class UInt8 extends UInt {
  public static readonly WIDTH: number = 1

  public static readonly DEFAULT_UINT_8: UInt8 = new UInt8(
    Buffer.alloc(UInt8.WIDTH),
  )

  public constructor(bytes: Buffer) {
    super(bytes ?? UInt8.DEFAULT_UINT_8.bytes)
  }

  public static fromParser(parser: BinaryParser): UInt {
    return new UInt8(parser.read(UInt8.WIDTH))
  }

  /**
   * Construct a UInt8 object from a number.
   *
   * @param val - UInt8 object or number.
   * @returns Constructed UInt8 object.
   * @throws Error.
   */
  public static from<T extends UInt8 | number>(val: T): UInt8 {
    if (val instanceof UInt8) {
      return val
    }

    if (typeof val === 'number') {
      const buf = Buffer.alloc(UInt8.WIDTH)
      buf.writeUInt8(val, 0)
      return new UInt8(buf)
    }

    throw new Error('Cannot construct UInt8 from given value')
  }

  /**
   * Get the value of a UInt8 object.
   *
   * @returns The number represented by this.bytes.
   */
  public valueOf(): number {
    return this.bytes.readUInt8(0)
  }
}
