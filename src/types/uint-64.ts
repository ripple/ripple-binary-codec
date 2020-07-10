import { UInt } from "./uint";

const HEX_REGEX = /^[A-F0-9]{16}$/;

class UInt64 extends UInt {
  static readonly width: number = 8;
  static readonly defaultUInt64: UInt64 = new UInt64(Buffer.alloc(UInt64.width))

  constructor(bytes: Buffer) {
    super(bytes ?? UInt64.defaultUInt64.bytes)
  }

  static from(val: UInt64 | string | bigint | number): UInt64 {
    if(val instanceof UInt64) {
      return val;
    }

    let buf = Buffer.alloc(UInt64.width);

    if(typeof val === "number") {
      if(val < 0) {
        throw new Error("value must be an unsigned integer");
      }
      buf.writeBigUInt64BE(BigInt(val));
    }
    else if (typeof val === "string") {
      if(!HEX_REGEX.test(val)) {
        throw new Error(val + "is not a valid hex-string")
      }
      buf = Buffer.from(val, "hex")
    }
    else { // typeof val === bigint
      buf.writeBigUInt64BE(val)
    }

    return new UInt64(buf);
  }

  toJSON(): string {
    return this.bytes.toString('hex').toUpperCase();
  }

  valueOf(): bigint {
    return this.bytes.readBigUInt64BE();
  }

  toBytes(): Buffer {
    return this.bytes;
  }
}

export { UInt64 };
