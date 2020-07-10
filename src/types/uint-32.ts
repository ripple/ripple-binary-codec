import { UInt } from "./uint";

class UInt32 extends UInt {
  static readonly width: number = 4
  static readonly defaultUInt32: UInt32 = new UInt32(Buffer.alloc(UInt32.width))

  constructor(bytes: Buffer) {
    super(bytes ?? UInt32.defaultUInt32.bytes)
  }

  static from(val: UInt32 | number): UInt32 {
    if(val instanceof UInt32) {
      return val;
    }

    let buf = Buffer.alloc(UInt32.width);
    buf.writeUInt32BE(val);
    return new UInt32(buf);
  }

  toJSON(): number {
    return this.valueOf()
  }

  valueOf(): number {
    return this.bytes.readUInt32BE();
  }
}

export { UInt32 };
