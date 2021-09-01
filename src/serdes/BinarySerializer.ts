/* eslint-disable no-bitwise -- this file needs to use bitwise operations */
import * as assert from 'assert'

import { Buffer } from 'buffer/'

import { FieldInstance } from '../enums'
import SerializedType from '../types/SerializedType'

import BytesList from './BytesList'

/**
 * BinarySerializer is used to write fields and values to buffers.
 */
export default class BinarySerializer {
  private readonly _sink: BytesList = new BytesList()

  public constructor(sink: BytesList) {
    this._sink = sink
  }

  /* eslint-disable max-statements, @typescript-eslint/no-magic-numbers --
   * TODO refactor */
  private static encodeVariableLength(inputLength: number): Buffer {
    let length = inputLength
    const lenBytes = Buffer.alloc(3)
    if (length <= 192) {
      lenBytes[0] = length
      return lenBytes.slice(0, 1)
    }
    if (length <= 12480) {
      length -= 193
      lenBytes[0] = 193 + (length >>> 8)
      lenBytes[1] = length & 0xff
      return lenBytes.slice(0, 2)
    }
    if (length <= 918744) {
      length -= 12481
      lenBytes[0] = 241 + (length >>> 16)
      lenBytes[1] = (length >> 8) & 0xff
      lenBytes[2] = length & 0xff
      return lenBytes.slice(0, 3)
    }
    throw new Error('Overflow error')
  }
  /* eslint-enable max-statements, @typescript-eslint/no-magic-numbers */

  /**
   * Write a value to this BinarySerializer.
   *
   * @param value - A SerializedType value.
   */
  public write(value: SerializedType): void {
    value.toBytesSink(this._sink)
  }

  /**
   * Write bytes to this BinarySerializer.
   *
   * @param bytes - The bytes to write.
   */
  public put(bytes: Buffer): void {
    this._sink.put(bytes)
  }

  /**
   * Write a value of a given type to this BinarySerializer.
   *
   * @param type - The type to write.
   * @param value - A value of that type.
   */
  public writeType(type: typeof SerializedType, value: SerializedType): void {
    this.write(type.from(value))
  }

  /**
   * Write BytesList to this BinarySerializer.
   *
   * @param bl - BytesList to write to BinarySerializer.
   */
  public writeBytesList(bl: BytesList): void {
    bl.toBytesSink(this._sink)
  }

  /**
   * Write field and value to BinarySerializer.
   *
   * @param field - Field to write to BinarySerializer.
   * @param value - Value to write to BinarySerializer.
   */
  public writeFieldAndValue(field: FieldInstance, value: SerializedType): void {
    const associatedValue = field.associatedType.from(value)
    assert(associatedValue.toBytesSink !== undefined)
    assert(field.name !== undefined)

    this._sink.put(field.header)

    if (field.isVariableLengthEncoded) {
      this.writeLengthEncoded(associatedValue)
    } else {
      associatedValue.toBytesSink(this._sink)
    }
  }

  /**
   * Write a variable length encoded value to the BinarySerializer.
   *
   * @param value - Length encoded value to write to BytesList.
   */
  public writeLengthEncoded(value: SerializedType): void {
    const bytes = new BytesList()
    value.toBytesSink(bytes)
    this.put(BinarySerializer.encodeVariableLength(bytes.getLength()))
    this.writeBytesList(bytes)
  }
}
