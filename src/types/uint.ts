import { ComparableClass } from "./serialized-type";
import { BinaryParser } from "../serdes/binary-parser";

/**
 * Compare numbers and bigints n1 and n2
 * 
 * @param n1 First object to compare
 * @param n2 Second object to compare
 * @returns -1, 0, or 1, depending on how the two objects compare
 */
function compare(n1: number | bigint, n2: number | bigint): number {
  return n1 < n2 ? -1 : n1 == n2 ? 0 : 1
}

/**
 * Base class for serializing and deserializing unsigned integers.
 */
class UInt extends ComparableClass {
  static width: number

  constructor(bytes: Buffer) {
    super(bytes)
  }

  static fromParser(parser: BinaryParser): UInt {
    return new this(parser.read(this.width));
  }

  /**
   * Overload of compareTo for Comparable
   * 
   * @param other other UInt to compare this to
   * @returns -1, 0, or 1 depending on how the objects relate to each other
   */
  compareTo(other: UInt): number {
    return compare(this.valueOf(), other.valueOf());
  }

  /**
   * Convert a UInt object to JSON
   * 
   * @returns number or string represented by this.bytes
   */
  toJSON(): number | string {
    let val = this.valueOf()
    return typeof val === "number"
      ? val
      : val.toString();
  }

  /**
   * Get the value of the UInt represented by this.bytes
   * 
   * @returns the value
   */
  valueOf(): number | bigint {
    throw new Error("Cannot get value of the UInt Base Class")
  }
}

export { UInt };
