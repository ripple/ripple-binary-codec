import { Buffer } from 'buffer/'

import BinaryParser from '../serdes/BinaryParser'

import SerializedType from './SerializedType'

/**
 * Variable length encoded type.
 */
export default class Blob extends SerializedType {
  /**
   * Defines how to read a Blob from a BinaryParser.
   *
   * @param parser - The binary parser to read the Blob from.
   * @param hint - The length of the blob, computed by readVariableLengthLength() and passed in.
   * @returns A Blob object.
   */
  public static fromParser(parser: BinaryParser, hint: number): Blob {
    return new Blob(parser.read(hint))
  }

  /**
   * Create a Blob object from a hex-string.
   *
   * @param value - Existing Blob object or a hex-string.
   * @returns A Blob object.
   * @throws Error.
   */
  public static from<T extends Blob | string>(value: T): Blob {
    if (value instanceof Blob) {
      return value
    }

    if (typeof value === 'string') {
      return new Blob(Buffer.from(value, 'hex'))
    }

    throw new Error('Cannot construct Blob from value given')
  }
}
