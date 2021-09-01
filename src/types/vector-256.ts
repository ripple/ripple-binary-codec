import BinaryParser from '../serdes/BinaryParser'
import BytesList from '../serdes/BytesList'

import Hash256 from './hash-256'
import SerializedType from './SerializedType'

function isStrings(arg): arg is string[] {
  return Array.isArray(arg) && (arg.length === 0 || typeof arg[0] === 'string')
}

const HASH_LENGTH_BYTES = 32

/**
 * Class for serializing and deserializing vectors of Hash256.
 */
export default class Vector256 extends SerializedType {
  /**
   * Construct a Vector256 from a BinaryParser.
   *
   * @param parser - BinaryParser to.
   * @param hint - Length of the vector, in bytes, optional.
   * @returns A Vector256 object.
   */
  public static fromParser(parser: BinaryParser, hint?: number): Vector256 {
    const bytesList = new BytesList()
    const bytes = hint ?? parser.size()
    const hashes = bytes / HASH_LENGTH_BYTES
    for (let i = 0; i < hashes; i++) {
      Hash256.fromParser(parser).toBytesSink(bytesList)
    }
    return new Vector256(bytesList.toBytes())
  }

  /**
   * Construct a Vector256 object from an array of hashes.
   *
   * @param value - A Vector256 object or array of hex-strings representing Hash256's.
   * @returns A Vector256 object.
   * @throws Error.
   */
  public static from<T extends Vector256 | string[]>(value: T): Vector256 {
    if (value instanceof Vector256) {
      return value
    }

    if (isStrings(value)) {
      const bytesList = new BytesList()
      value.forEach((hash) => {
        Hash256.from(hash).toBytesSink(bytesList)
      })
      return new Vector256(bytesList.toBytes())
    }

    throw new Error('Cannot construct Vector256 from given value')
  }

  /**
   * Return an Array of hex-strings represented by this.bytes.
   *
   * @returns An Array of strings representing the Hash256 objects.
   * @throws Error.
   */
  public toJSON(): string[] {
    if (this.bytes.byteLength % HASH_LENGTH_BYTES !== 0) {
      throw new Error('Invalid bytes for Vector256')
    }

    const result: string[] = []
    for (let i = 0; i < this.bytes.byteLength; i += HASH_LENGTH_BYTES) {
      result.push(
        this.bytes
          .slice(i, i + HASH_LENGTH_BYTES)
          .toString('hex')
          .toUpperCase(),
      )
    }
    return result
  }
}
