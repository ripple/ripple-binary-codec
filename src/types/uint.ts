import * as bigInt from 'big-integer'

import Comparable from './Comparable'

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
  public compareTo(other: UInt): number {
    let myValue = this.valueOf()
    let theirValue = other.valueOf()
    if (typeof myValue === 'number') {
      myValue = bigInt(myValue)
    }
    if (typeof theirValue === 'number') {
      theirValue = bigInt(theirValue)
    }
    return myValue.compare(theirValue)
  }

  /**
   * Convert a UInt object to JSON.
   *
   * @returns Number or string represented by this.bytes.
   */
  public toJSON(): number | string {
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
