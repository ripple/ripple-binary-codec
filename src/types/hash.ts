import * as assert from "assert";
import { ComparableClass } from "./serialized-type";
import { BinaryParser } from "../serdes/binary-parser";

class Hash extends ComparableClass {
  static width: number

  constructor(bytes: Buffer) {
    super()
    const width = (this.constructor as typeof Hash).width;
    this.bytes = bytes
      ? Buffer.from(bytes)
      : Buffer.alloc(width);
    assert.equal(this.bytes.byteLength, width);
  }

  static from(value: Hash | string): Hash {
    if (value instanceof this) {
      return value;
    }
    return new this(Buffer.from(value, 'hex'));
  }
  
  static fromParser(parser: BinaryParser, hint?: number): Hash {
    return new this(parser.read(hint || this.width));
  }
  
  compareTo(other: Hash): number {
    return Buffer.compare(this.bytes, (this.constructor as typeof Hash).from(other).bytes);
  }

  toString(): string {
    return this.toHex();
  }

  nibblet(depth) {
    const byteIx = depth > 0 ? (depth / 2) | 0 : 0;
    let b = this.bytes[byteIx];
    if (depth % 2 === 0) {
      b = (b & 0xf0) >>> 4;
    } else {
      b = b & 0x0f;
    }
    return b;
  }
}

export { Hash };
