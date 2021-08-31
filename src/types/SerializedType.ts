import * as bigInt from 'big-integer'
import { Buffer } from 'buffer/'

import type BinaryParser from '../serdes/BinaryParser'
import BytesList from '../serdes/BytesList'

export type JSON =
  | string
  | number
  | boolean
  | null
  | undefined
  | JSON[]
  | JsonObject

export interface JsonObject {
  [key: string]: JSON
}

/**
 * The base class for all binary-codec types.
 */
export default class SerializedType {
  protected readonly bytes: Buffer = Buffer.alloc(0)

  constructor(bytes: Buffer) {
    this.bytes = bytes ?? Buffer.alloc(0)
  }

  static fromParser(parser: BinaryParser, hint?: number): SerializedType {
    throw new Error('fromParser not implemented')
    return this.fromParser(parser, hint)
  }

  static from(
    value: SerializedType | JSON | bigInt.BigInteger,
  ): SerializedType {
    throw new Error('from not implemented')
    return this.from(value)
  }

  /**
   * Write the bytes representation of a SerializedType to a BytesList.
   *
   * @param list - The BytesList to write SerializedType bytes to.
   */
  toBytesSink(list: BytesList): void {
    list.put(this.bytes)
  }

  /**
   * Get the hex representation of a SerializedType's bytes.
   *
   * @returns Hex String of this.bytes.
   */
  toHex(): string {
    return this.toBytes().toString('hex').toUpperCase()
  }

  /**
   * Get the bytes representation of a SerializedType.
   *
   * @returns A buffer of the bytes.
   */
  toBytes(): Buffer {
    if (this.bytes) {
      return this.bytes
    }
    const bytes = new BytesList()
    this.toBytesSink(bytes)
    return bytes.toBytes()
  }

  /**
   * Return the JSON representation of a SerializedType.
   *
   * @returns Any type, if not overloaded returns hexString representation of bytes.
   */
  toJSON(): JSON {
    return this.toHex()
  }

  /**
   * @returns HexString representation of this.bytes.
   */
  toString(): string {
    return this.toHex()
  }
}
