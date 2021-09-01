/* eslint-disable no-bitwise -- this file needs to use bitwise operations */
import { Buffer } from 'buffer/'

import BinaryParser from '../serdes/BinaryParser'

import Comparable from './Comparable'

/**
 * Base class defining how to encode and decode hashes.
 */
export default class Hash extends Comparable {
  public static readonly WIDTH: number

  public constructor(bytes: Buffer) {
    super(bytes)
    /* eslint-disable @typescript-eslint/consistent-type-assertions ---
     * we want this so that classes that inherit can use their own width
     * property */
    if (this.bytes.byteLength !== (this.constructor as typeof Hash).WIDTH) {
      /* eslint-enable @typescript-eslint/consistent-type-assertions */
      throw new Error(`Invalid Hash length ${this.bytes.byteLength}`)
    }
  }

  /**
   * Construct a Hash object from an existing Hash object or a hex-string.
   *
   * @param value - A hash object or hex-string of a hash.
   * @returns A Hash object from `value`.
   * @throws Error.
   */
  public static from<T extends Hash | string>(value: T): Hash {
    if (value instanceof this) {
      return value
    }

    if (typeof value === 'string') {
      return new this(Buffer.from(value, 'hex'))
    }

    throw new Error('Cannot construct Hash from given value')
  }

  /**
   * Read a Hash object from a BinaryParser.
   *
   * @param parser - BinaryParser to read the hash from.
   * @param hint - Length of the bytes to read, optional.
   * @returns The Hash object read from `parser`.
   */
  public static fromParser(parser: BinaryParser, hint?: number): Hash {
    return new this(parser.read(hint ?? this.WIDTH))
  }

  /**
   * Overloaded operator for comparing two hash objects.
   *
   * @param other - The Hash to compare this to.
   * @returns 1 if this Hash is greater than `other`, -1 if this Hash is less
   * than `other`, and 0 if the two are equal.
   */
  public compareTo(other: Hash): number {
    return this.bytes.compare(
      /* eslint-disable @typescript-eslint/consistent-type-assertions ---
       * we want this so that classes that inherit can use their own width
       * property */
      (this.constructor as typeof Hash).from(other).bytes,
      /* eslint-enable @typescript-eslint/consistent-type-assertions */
    )
  }

  /**
   * Returns the hex-string representation of this Hash.
   *
   * @returns The hex-string representation of this Hash.
   */
  public toString(): string {
    return this.toHex()
  }

  /**
   * Returns four bits at the specified depth within a hash.
   *
   * @param depth - The depth of the four bits.
   * @returns The number represented by the four bits.
   */
  public nibblet(depth: number): number {
    /* eslint-disable @typescript-eslint/no-magic-numbers ---
     * TODO either make these constants or explain */
    const byteIx = depth > 0 ? (depth / 2) | 0 : 0
    const bits = this.bytes[byteIx]
    if (depth % 2 === 0) {
      return (bits & 0xf0) >>> 4
    }
    return bits & 0x0f
    /* eslint-enable @typescript-eslint/no-magic-numbers */
  }
}
