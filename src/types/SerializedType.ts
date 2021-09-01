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

  public constructor(bytes: Buffer) {
    this.bytes = bytes ?? Buffer.alloc(0)
  }

  public static fromParser(
    parser: BinaryParser,
    hint?: number,
  ): SerializedType {
    throw new Error('fromParser not implemented')
    return this.fromParser(parser, hint)
  }

  public static from(
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
  public toBytesSink(list: BytesList): void {
    list.put(this.bytes)
  }

  /**
   * Get the hex representation of a SerializedType's bytes.
   *
   * @returns Hex String of this.bytes.
   */
  public toHex(): string {
    return this.toBytes().toString('hex').toUpperCase()
  }

  /**
   * Get the bytes representation of a SerializedType.
   *
   * @returns A buffer of the bytes.
   */
  public toBytes(): Buffer {
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
  public toJSON(): JSON {
    return this.toHex()
  }

  /**
   * Return the HexString representation of this type.
   *
   * @returns HexString representation of this.bytes.
   */
  public toString(): string {
    return this.toHex()
  }
}
