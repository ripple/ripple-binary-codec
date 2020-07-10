import { UInt } from "./uint";

/**
 * Derived UInt class for serializing/deserializing 16 bit UInt
 */
class UInt16 extends UInt {
  static readonly width: number = 2
  static readonly defaultUInt16: UInt16 = new UInt16(Buffer.alloc(UInt16.width))

  constructor(bytes: Buffer) {
    super(bytes ?? UInt16.defaultUInt16.bytes)
  }

  /**
   * Construct a UInt16 object from a number
   * 
   * @param val UInt16 object or number
   */
  static from(val: UInt16 | number): UInt16 {
    if(val instanceof UInt16) {
      return val;
    }

    let buf = Buffer.alloc(UInt16.width);
    buf.writeUInt16BE(val);
    return new UInt16(buf);
  }

  /**
   * get the value of a UInt16 object
   * 
   * @returns the number represented by this.bytes
   */
  valueOf(): number {
    return this.bytes.readUInt16BE();
  }
}

export { UInt16 };
