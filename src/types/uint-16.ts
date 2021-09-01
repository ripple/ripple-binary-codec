import { Buffer } from 'buffer/'

import type BinaryParser from '../serdes/BinaryParser'

import UInt from './uint'

/**
 * Derived UInt class for serializing/deserializing 16 bit UInt.
 */
export default class UInt16 extends UInt {
  public static readonly WIDTH: number = 2

  public static readonly DEFAULT_UINT_16: UInt16 = new UInt16(
    Buffer.alloc(UInt16.WIDTH),
  )

  public constructor(bytes: Buffer) {
    super(bytes ?? UInt16.DEFAULT_UINT_16.bytes)
  }

  public static fromParser(parser: BinaryParser): UInt {
    return new UInt16(parser.read(UInt16.WIDTH))
  }

  /**
   * Construct a UInt16 object from a number.
   *
   * @param val - UInt16 object or number.
   * @returns Constructed UInt16 instance.
   * @throws Error.
   */
  public static from<T extends UInt16 | number>(val: T): UInt16 {
    if (val instanceof UInt16) {
      return val
    }

    if (typeof val === 'number') {
      const buf = Buffer.alloc(UInt16.WIDTH)
      buf.writeUInt16BE(val, 0)
      return new UInt16(buf)
    }

    throw new Error('Can not construct UInt16 with given value')
  }

  /**
   * Get the value of a UInt16 object.
   *
   * @returns The number represented by this.bytes.
   */
  public valueOf(): number {
    return this.bytes.readUInt16BE(0)
  }
}
