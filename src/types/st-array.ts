import { Buffer } from 'buffer/'

import BinaryParser from '../serdes/BinaryParser'

import SerializedType, { JsonObject } from './SerializedType'
import STObject from './st-object'

const ARRAY_END_MARKER = Buffer.from([0xf1])
const ARRAY_END_MARKER_NAME = 'ArrayEndMarker'

const OBJECT_END_MARKER = Buffer.from([0xe1])

function isObjects(args): args is JsonObject[] {
  return (
    Array.isArray(args) && (args.length === 0 || typeof args[0] === 'object')
  )
}

/**
 * Class for serializing and deserializing Arrays of Objects.
 */
export default class STArray extends SerializedType {
  /**
   * Construct an STArray from a BinaryParser.
   *
   * @param parser - BinaryParser to parse an STArray from.
   * @returns An STArray Object.
   */
  static fromParser(parser: BinaryParser): STArray {
    const bytes: Buffer[] = []

    while (!parser.end()) {
      const field = parser.readField()
      if (field.name === ARRAY_END_MARKER_NAME) {
        break
      }

      bytes.push(
        field.header,
        parser.readFieldValue(field).toBytes(),
        OBJECT_END_MARKER,
      )
    }

    bytes.push(ARRAY_END_MARKER)
    return new STArray(Buffer.concat(bytes))
  }

  /**
   * Construct an STArray from an Array of JSON Objects.
   *
   * @param value - STArray or Array of Objects to parse into an STArray.
   * @returns An STArray object.
   * @throws {Error}
   */
  static from<T extends STArray | JsonObject[]>(value: T): STArray {
    if (value instanceof STArray) {
      return value
    }

    if (isObjects(value)) {
      const bytes: Buffer[] = []
      value.forEach((obj) => {
        bytes.push(STObject.from(obj).toBytes())
      })

      bytes.push(ARRAY_END_MARKER)
      return new STArray(Buffer.concat(bytes))
    }

    throw new Error('Cannot construct STArray from value given')
  }

  /**
   * Return the JSON representation of this.bytes.
   *
   * @returns An Array of JSON objects.
   */
  toJSON(): JsonObject[] {
    const result: JsonObject[] = []

    const arrayParser = new BinaryParser(this.toString())

    while (!arrayParser.end()) {
      const field = arrayParser.readField()
      if (field.name === ARRAY_END_MARKER_NAME) {
        break
      }

      const outer = {}
      outer[field.name] = STObject.fromParser(arrayParser).toJSON()
      result.push(outer)
    }

    return result
  }
}
