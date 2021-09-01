import { Buffer } from 'buffer/'

import type BinaryParser from '../serdes/BinaryParser'

import UInt from './uint'

/**
 * Derived UInt class for serializing/deserializing 32 bit UInt.
 */
export default class UInt32 extends UInt {
  public static readonly WIDTH: number = 4

  public static readonly DEFAULT_UINT_32: UInt32 = new UInt32(
    Buffer.alloc(UInt32.WIDTH),
  )

  public constructor(bytes: Buffer) {
    super(bytes ?? UInt32.DEFAULT_UINT_32.bytes)
  }

  public static fromParser(parser: BinaryParser): UInt {
    return new UInt32(parser.read(UInt32.WIDTH))
  }

  /**
   * Construct a UInt32 object from a number.
   *
   * @param val - UInt32 object or number.
   * @returns Constructed UInt32 instance.
   * @throws Error.
   */
  public static from<T extends UInt32 | number | string>(val: T): UInt32 {
    if (val instanceof UInt32) {
      return val
    }

    const buf = Buffer.alloc(UInt32.WIDTH)

    if (typeof val === 'string') {
      const num = Number.parseInt(val, 10)
      buf.writeUInt32BE(num, 0)
      return new UInt32(buf)
    }

    if (typeof val === 'number') {
      buf.writeUInt32BE(val, 0)
      return new UInt32(buf)
    }

    throw new Error('Cannot construct UInt32 from given value')
  }

  /**
   * Get the value of a UInt32 object.
   *
   * @returns The number represented by this.bytes.
   */
  public valueOf(): number {
    return this.bytes.readUInt32BE(0)
  }
}
