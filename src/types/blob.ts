import { SerializedTypeClass } from "./serialized-type";
import { BinaryParser } from "../serdes/binary-parser";

class Blob extends SerializedTypeClass {
  constructor(bytes: Buffer) {
    super()
    if (bytes) {
      this.bytes = bytes;
    } else {
      this.bytes = Buffer.alloc(0);
    }
  }

  static fromParser(parser: BinaryParser, hint: number): Blob {
    return new this(parser.read(hint));
  }

  static from(value: Blob | string) {
    if (value instanceof Blob) {
      return value;
    }
    return new this(Buffer.from(value, 'hex'));
  }
}

export { Blob };
