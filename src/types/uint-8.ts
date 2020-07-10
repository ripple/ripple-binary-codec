import { UInt } from "./uint";

class UInt8 extends UInt {
  static readonly width: number = 1
  static readonly defaultUInt8: UInt8 = new UInt8(Buffer.alloc(UInt8.width))

  constructor(bytes: Buffer) {
    super(bytes ?? UInt8.defaultUInt8.bytes)
  }

  static from(val: UInt8 | number): UInt8 {
    if(val instanceof UInt8) {
      return val;
    }

    let buf = Buffer.alloc(UInt8.width);
    buf.writeUInt8(val);
    return new UInt8(buf);
  }

  valueOf(): number {
    return this.bytes.readUInt8();
  }
}

export { UInt8 };
