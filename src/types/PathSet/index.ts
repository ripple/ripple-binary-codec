import { Buffer } from 'buffer/'

import BinaryParser from '../../serdes/BinaryParser'
import SerializedType from '../SerializedType'

import { HopObject } from './Hop'
import Path, { PATHSET_END_BYTE, PATH_SEPARATOR_BYTE } from './Path'

function isHopObject(arg): arg is HopObject {
  return (
    (arg as HopObject)?.issuer !== undefined ||
    (arg as HopObject)?.account !== undefined ||
    (arg as HopObject)?.currency !== undefined
  )
}

function isPathSet(arg): arg is HopObject[][] {
  return (
    (Array.isArray(arg) && arg.length === 0) ||
    (Array.isArray(arg) && Array.isArray(arg[0]) && arg[0].length === 0) ||
    (Array.isArray(arg) && Array.isArray(arg[0]) && isHopObject(arg[0][0]))
  )
}

/**
 * Deserialize and Serialize the PathSet type.
 */
export default class PathSet extends SerializedType {
  /**
   * Construct a PathSet from an Array of Arrays representing paths.
   *
   * @param value - A PathSet or Array of Array of HopObjects.
   * @returns The PathSet constructed from value.
   * @throws {Error}
   */
  static from<T extends PathSet | HopObject[][]>(value: T): PathSet {
    if (value instanceof PathSet) {
      return value
    }

    if (isPathSet(value)) {
      const bytes: Buffer[] = []

      value.forEach((path: HopObject[]) => {
        bytes.push(Path.from(path).toBytes())
        bytes.push(Buffer.from([PATH_SEPARATOR_BYTE]))
      })

      bytes[bytes.length - 1] = Buffer.from([PATHSET_END_BYTE])

      return new PathSet(Buffer.concat(bytes))
    }

    throw new Error('Cannot construct PathSet from given value')
  }

  /**
   * Construct a PathSet from a BinaryParser.
   *
   * @param parser - A BinaryParser to read PathSet from.
   * @returns The PathSet read from parser.
   */
  static fromParser(parser: BinaryParser): PathSet {
    const bytes: Buffer[] = []

    while (!parser.end()) {
      bytes.push(Path.fromParser(parser).toBytes())
      bytes.push(parser.read(1))

      if (bytes[bytes.length - 1][0] === PATHSET_END_BYTE) {
        break
      }
    }

    return new PathSet(Buffer.concat(bytes))
  }

  /**
   * Get the JSON representation of this PathSet.
   *
   * @returns An Array of Array of HopObjects, representing this PathSet.
   */
  toJSON(): HopObject[][] {
    const json: HopObject[][] = []
    const pathParser = new BinaryParser(this.toString())

    while (!pathParser.end()) {
      json.push(Path.fromParser(pathParser).toJSON())
      pathParser.skip(1)
    }

    return json
  }
}
