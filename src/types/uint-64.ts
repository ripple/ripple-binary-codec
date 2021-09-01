import * as bigInt from 'big-integer'
import { isInstance } from 'big-integer'
import { Buffer } from 'buffer/'

import type BinaryParser from '../serdes/BinaryParser'

import UInt from './uint'

const HEX_REGEX = /^[a-fA-F0-9]{1,16}$/u
/* eslint-disable @typescript-eslint/no-magic-numbers ---
 * this clearly is a constant but the linter doesn't like the call to bigInt
 * */
const MASK = bigInt(0x00000000ffffffff)
/* eslint-enable @typescript-eslint/no-magic-numbers */

/**
 * Derived UInt class for serializing/deserializing 64 bit UInt.
 */
export default class UInt64 extends UInt {
  public static readonly WIDTH: number = 8

  public static readonly DEFAULT_UINT_64: UInt64 = new UInt64(
    Buffer.alloc(UInt64.WIDTH),
  )

  public constructor(bytes: Buffer) {
    super(bytes ?? UInt64.DEFAULT_UINT_64.bytes)
  }

  public static fromParser(parser: BinaryParser): UInt {
    return new UInt64(parser.read(UInt64.WIDTH))
  }

  /**
   * Construct a UInt64 object.
   *
   * @param val - A UInt64, hex-string, bigInt, or number.
   * @returns A UInt64 object.
   * @throws Error.
   */
  public static from<T extends UInt64 | string | bigInt.BigInteger | number>(
    val: T,
  ): UInt64 {
    if (val instanceof UInt64) {
      return val
    }
    if (typeof val === 'number') {
      return UInt64.fromNumber(val)
    }
    if (typeof val === 'string') {
      return UInt64.fromString(val)
    }
    if (isInstance(val)) {
      return UInt64.fromBigInt(val)
    }
    throw new Error('Cannot construct UInt64 from given value')
  }

  private static fromNumber(val: number): UInt64 {
    if (val < 0) {
      throw new Error('value must be an unsigned integer')
    }
    return UInt64.fromBigInt(bigInt(val))
  }

  private static fromString(val: string): UInt64 {
    if (!HEX_REGEX.test(val)) {
      throw new Error(`${val} is not a valid hex-string`)
    }
    /* eslint-disable @typescript-eslint/no-magic-numbers ---
     * TODO not exactly sure why this has to be 16 chars long and someone can
     * rewrite this explanation better in the future lol */
    return new UInt64(Buffer.from(val.padStart(16, '0'), 'hex'))
    /* eslint-enable @typescript-eslint/no-magic-numbers */
  }

  private static fromBigInt(val: bigInt.BigInteger): UInt64 {
    /* eslint-disable @typescript-eslint/no-magic-numbers ---
     * we're cutting the byte in half here pretty clearly and defining
     * constants for these values is silly */
    const intBuf = [Buffer.alloc(4), Buffer.alloc(4)]
    intBuf[0].writeUInt32BE(Number(val.shiftRight(bigInt(32))), 0)
    intBuf[1].writeUInt32BE(Number(val.and(MASK)), 0)
    return new UInt64(Buffer.concat(intBuf))
    /* eslint-enable @typescript-eslint/no-magic-numbers */
  }

  /**
   * The JSON representation of a UInt64 object.
   *
   * @returns A hex-string.
   */
  public toJSON(): string {
    return this.bytes.toString('hex').toUpperCase()
  }

  /**
   * Get the value of the UInt64.
   *
   * @returns The number represented buy this.bytes.
   */
  public valueOf(): bigInt.BigInteger {
    /* eslint-disable @typescript-eslint/no-magic-numbers ---
     * we're cutting the byte in half here pretty clearly and defining
     * constants for these values is silly */
    const msb = bigInt(this.bytes.slice(0, UInt64.WIDTH / 2).readUInt32BE(0))
    const lsb = bigInt(this.bytes.slice(UInt64.WIDTH / 2).readUInt32BE(0))
    return msb.shiftLeft(bigInt(32)).or(lsb)
    /* eslint-enable @typescript-eslint/no-magic-numbers */
  }

  /**
   * Get the bytes representation of the UInt64 object.
   *
   * @returns 8 bytes representing the UInt64.
   */
  public toBytes(): Buffer {
    return this.bytes
  }
}
