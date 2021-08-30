import * as bigInt from 'big-integer'
import { Buffer } from 'buffer/'

import { Comparable } from './serialized-type'

/**
 * Compare numbers and bigInts n1 and n2.
 *
 * @param n1 - First object to compare.
 * @param n2 - Second object to compare.
 * @returns 1, 0, or 1, depending on how the two objects compare.
 */
function compare(
  n1: number | bigInt.BigInteger,
  n2: number | bigInt.BigInteger,
): number {
  return bigInt(n1).compare(n2)
}

/**
 * Base class for serializing and deserializing unsigned integers.
 */
export default abstract class UInt extends Comparable {
  protected static width: number

  /**
   * Overload of compareTo for Comparable.
   *
   * @param other - Other UInt to compare this to.
   * @returns 1, 0, or 1 depending on how the objects relate to each other.
   */
  compareTo(other: UInt): number {
    return compare(this.valueOf(), other.valueOf())
  }

  /**
   * Convert a UInt object to JSON.
   *
   * @returns Number or string represented by this.bytes.
   */
  toJSON(): number | string {
    const val = this.valueOf()
    return typeof val === 'number' ? val : val.toString()
  }

  /**
   * Get the value of the UInt represented by this.bytes.
   *
   * @returns The value.
   */
  abstract valueOf(): number | bigInt.BigInteger
}
