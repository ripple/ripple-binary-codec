/* eslint-disable no-bitwise -- this file needs to use bitwise operations */
import * as assert from 'assert'

import { Buffer } from 'buffer/'

import { Field, FieldInstance } from '../enums'
import SerializedType from '../types/SerializedType'

/**
 * BinaryParser is used to compute fields and values from a HexString.
 */
export default class BinaryParser {
  private bytes: Buffer

  /**
   * Initialize bytes to a hex string.
   *
   * @param hexBytes - A hex string.
   */
  constructor(hexBytes: string) {
    this.bytes = Buffer.from(hexBytes, 'hex')
  }

  /**
   * Peek the first byte of the BinaryParser.
   *
   * @returns The first byte of the BinaryParser.
   */
  peek(): number {
    assert(this.bytes.byteLength !== 0)
    return this.bytes[0]
  }

  /**
   * Consume the first n bytes of the BinaryParser.
   *
   * @param n - The number of bytes to skip.
   */
  skip(n: number): void {
    assert(n <= this.bytes.byteLength)
    this.bytes = this.bytes.slice(n)
  }

  /**
   * Read the first n bytes from the BinaryParser.
   *
   * @param n - The number of bytes to read.
   * @returns The bytes.
   */
  read(n: number): Buffer {
    assert(n <= this.bytes.byteLength)

    const slice = this.bytes.slice(0, n)
    this.skip(n)
    return slice
  }

  /**
   * Read an integer of given size.
   *
   * @param n - The number of bytes to read.
   * @returns The number represented by those bytes.
   */
  readUIntN(n: number): number {
    assert(n > 0 && n <= 4, 'invalid n')
    return this.read(n).reduce((accum, current) => (accum << 8) | current) >>> 0
  }

  readUInt8(): number {
    return this.readUIntN(1)
  }

  readUInt16(): number {
    return this.readUIntN(2)
  }

  readUInt32(): number {
    return this.readUIntN(4)
  }

  size(): number {
    return this.bytes.byteLength
  }

  end(customEnd?: number): boolean {
    const length = this.bytes.byteLength
    return length === 0 || (customEnd !== undefined && length <= customEnd)
  }

  /**
   * Reads variable length encoded bytes.
   *
   * @returns The variable length bytes.
   */
  readVariableLength(): Buffer {
    return this.read(this.readVariableLengthLength())
  }

  /**
   * Reads the length of the variable length encoded bytes.
   *
   * @returns The length of the variable length encoded bytes.
   * @throws {Error}
   */
  readVariableLengthLength(): number {
    const b1 = this.readUInt8()
    if (b1 <= 192) {
      return b1
    }
    if (b1 <= 240) {
      const b2 = this.readUInt8()
      return 193 + (b1 - 193) * 256 + b2
    }
    if (b1 <= 254) {
      const b2 = this.readUInt8()
      const b3 = this.readUInt8()
      return 12481 + (b1 - 241) * 65536 + b2 * 256 + b3
    }
    throw new Error('Invalid variable length indicator')
  }

  /**
   * Reads the field ordinal from the BinaryParser.
   *
   * @returns Field ordinal.
   * @throws {Error}
   */
  readFieldOrdinal(): number {
    let type = this.readUInt8()
    let nth = type & 15
    type >>= 4

    if (type === 0) {
      type = this.readUInt8()
      if (type === 0 || type < 16) {
        throw new Error('Cannot read FieldOrdinal, type_code out of range')
      }
    }

    if (nth === 0) {
      nth = this.readUInt8()
      if (nth === 0 || nth < 16) {
        throw new Error('Cannot read FieldOrdinal, field_code out of range')
      }
    }

    return (type << 16) | nth
  }

  /**
   * Read the field from the BinaryParser.
   *
   * @returns The field represented by the bytes at the head of the BinaryParser.
   */
  readField(): FieldInstance {
    return Field.get(this.readFieldOrdinal().toString())
  }

  /**
   * Read a given type from the BinaryParser.
   *
   * @param type - The type that you want to read from the BinaryParser.
   * @returns The instance of that type read from the BinaryParser.
   */
  readType(type: typeof SerializedType): SerializedType {
    return type.fromParser(this)
  }

  /**
   * Get the type associated with a given field.
   *
   * @param field - The field that you wan to get the type of.
   * @returns The type associated with the given field.
   */
  typeForField(field: FieldInstance): typeof SerializedType {
    return field.associatedType
  }

  /**
   * Read value of the type specified by field from the BinaryParser.
   *
   * @param field - The field that you want to get the associated value for.
   * @returns The value associated with the given field.
   * @throws {Error}
   */
  readFieldValue(field: FieldInstance): SerializedType {
    const type = this.typeForField(field)
    if (!type) {
      throw new Error(`unsupported: (${field.name}, ${field.type.name})`)
    }
    const sizeHint = field.isVariableLengthEncoded
      ? this.readVariableLengthLength()
      : undefined
    const value = type.fromParser(this, sizeHint)
    if (value === undefined) {
      throw new Error(
        `fromParser for (${field.name}, ${field.type.name}) -> undefined `,
      )
    }
    return value
  }

  /**
   * Get the next field and value from the BinaryParser.
   *
   * @returns The field and value.
   */
  readFieldAndValue(): [FieldInstance, SerializedType] {
    const field = this.readField()
    return [field, this.readFieldValue(field)]
  }
}
