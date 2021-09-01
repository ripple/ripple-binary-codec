import { Buffer } from 'buffer/'

import BinaryParser from '../../serdes/BinaryParser'
import SerializedType from '../SerializedType'

import Hop, { HopObject } from './Hop'

/**
 * Constants for separating Paths in a PathSet.
 */
export const PATHSET_END_BYTE = 0x00
export const PATH_SEPARATOR_BYTE = 0xff

/**
 * Class for serializing/deserializing Paths.
 */
export default class Path extends SerializedType {
  /**
   * Construct a Path from an array of Hops.
   *
   * @param value - Path or array of HopObjects to construct a Path.
   * @returns The Path.
   */
  public static from(value: Path | HopObject[]): Path {
    if (value instanceof Path) {
      return value
    }

    const bytes: Buffer[] = []
    value.forEach((hop: HopObject) => {
      bytes.push(Hop.from(hop).toBytes())
    })

    return new Path(Buffer.concat(bytes))
  }

  /**
   * Read a Path from a BinaryParser.
   *
   * @param parser - BinaryParser to read Path from.
   * @returns The Path represented by the bytes read from the BinaryParser.
   */
  public static fromParser(parser: BinaryParser): Path {
    const bytes: Buffer[] = []
    while (!parser.end()) {
      bytes.push(Hop.fromParser(parser).toBytes())

      if (
        parser.peek() === PATHSET_END_BYTE ||
        parser.peek() === PATH_SEPARATOR_BYTE
      ) {
        break
      }
    }
    return new Path(Buffer.concat(bytes))
  }

  /**
   * Get the JSON representation of this Path.
   *
   * @returns An Array of HopObject constructed from this.bytes.
   */
  public toJSON(): HopObject[] {
    const json: HopObject[] = []
    const pathParser = new BinaryParser(this.toString())

    while (!pathParser.end()) {
      json.push(Hop.fromParser(pathParser).toJSON())
    }

    return json
  }
}
