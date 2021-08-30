import BinaryParser from '../serdes/binary-parser'
import { BytesList } from '../serdes/binary-serializer'

import Hash256 from './hash-256'
import { SerializedType } from './serialized-type'

function isStrings(arg): arg is string[] {
  return Array.isArray(arg) && (arg.length === 0 || typeof arg[0] === 'string')
}

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
  static fromParser(parser: BinaryParser, hint?: number): Vector256 {
    const bytesList = new BytesList()
    const bytes = hint ?? parser.size()
    const hashes = bytes / 32
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
   * @throws {Error}
   */
  static from<T extends Vector256 | string[]>(value: T): Vector256 {
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
   * @throws {Error}
   */
  toJSON(): string[] {
    if (this.bytes.byteLength % 32 !== 0) {
      throw new Error('Invalid bytes for Vector256')
    }

    const result: string[] = []
    for (let i = 0; i < this.bytes.byteLength; i += 32) {
      result.push(
        this.bytes
          .slice(i, i + 32)
          .toString('hex')
          .toUpperCase(),
      )
    }
    return result
  }
}
