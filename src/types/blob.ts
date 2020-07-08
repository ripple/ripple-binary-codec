import { SerializedTypeClass } from "./serialized-type";
import { BinaryParser } from "../serdes/binary-parser";

/**
 * Variable length encoded type
 */
class Blob extends SerializedTypeClass {
  constructor(bytes: Buffer) {
    super();
    this.bytes = bytes ?? Buffer.alloc(0);
  }

  /**
   * Defines how to read a Blob from a BinaryParser
   *
   * @param parser The binary parser to read the Blob from
   * @param hint The length of the blob, computed by readVariableLengthLength() and passed in
   * @returns A Blob object
   */
  static fromParser(parser: BinaryParser, hint: number): Blob {
    return new this(parser.read(hint));
  }

  /**
   * Create a Blob object from a hex-string
   *
   * @param value existing Blob object or a hex-string
   * @returns A Blob object
   */
  static from(value: Blob | string): Blob {
    return value instanceof Blob ? value : new this(Buffer.from(value, "hex"));
  }
}

export { Blob };
