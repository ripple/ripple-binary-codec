import { ComparableClass } from "./serialized-type";
import { BytesList } from "../serdes/binary-serializer";

function compare(n1: number | bigint, n2: number | bigint): number {
  return n1 < n2 ? -1 : n1 == n2 ? 0 : 1
}

class UInt extends ComparableClass {
  static width: number

  constructor(bytes: Buffer) {
    super(bytes)
  }

  static fromParser(parser) {
    return new this(parser.read(this.width));
  }

  compareTo(other: UInt): number {
    return compare(this.valueOf(), other.valueOf());
  }

  toJSON(): number | string {
    let val = this.valueOf()
    return typeof val === "number"
      ? val
      : val.toString();
  }

  valueOf(): number | bigint {
    throw new Error("Cannot get value of the UInt Base Class")
  }

  toBytesSink(sink: BytesList): void {
    sink.put(this.bytes);
  }
}

export { UInt };
