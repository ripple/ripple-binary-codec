import * as assert from "assert";
import { Field, FieldInstance } from "../definitions";

class BinaryParser {
  _buf: Buffer;

  constructor(buf: string) {
    this._buf = Buffer.from(buf, "hex");
  }

  skip(n: number): void {
    assert(n <= this._buf.byteLength);
    this._buf = this._buf.slice(n);
  }

  /*
   * @brief: reads the first n bytes from the BinaryParser
   */ 
  read(n: number): Buffer {
    assert(n <= this._buf.byteLength);

    const slice = this._buf.slice(0, n);
    this.skip(n);
    return slice;
  }

  /*
   * @brief: reads unsigned int of specified length n
   */ 
  readUIntN(n: number): number {
    return this.read(n).reduce((a, b) => (a << 8) | b) >>> 0;
  }

  readUInt8(): number {
    return this.readUIntN(1);
  }

  readUInt16(): number {
    return this.readUIntN(2);
  }

  readUInt32(): number {
    return this.readUIntN(4);
  }

  size(): number {
    return this._buf.byteLength;
  }

  end(customEnd?: number): boolean {
    const length = this._buf.byteLength;
    return length === 0 || (customEnd !== undefined && length <= customEnd);
  }

  /*
   * @brief: Reads a variable length encoded chunk of bytes
   */
  readVL(): Buffer {
    return this.read(this.readVLLength());
  }

  /*
   * @brief: calculates the length of a variable length encoded chunk from the first three bytes.
   */
  readVLLength(): number {
    const b1 = this.readUInt8();
    if (b1 <= 192) {
      return b1;
    } else if (b1 <= 240) {
      const b2 = this.readUInt8();
      return 193 + (b1 - 193) * 256 + b2;
    } else if (b1 <= 254) {
      const b2 = this.readUInt8();
      const b3 = this.readUInt8();
      return 12481 + (b1 - 241) * 65536 + b2 * 256 + b3;
    }
    throw new Error("Invalid varint length indicator");
  }

  /*
   * @brief: Reads the field ordinal (number representing a field) from the parser
   */ 
  readFieldOrdinal(): number {
    const tagByte = this.readUInt8();
    const type = (tagByte & 0xf0) >>> 4 || this.readUInt8();
    const nth = tagByte & 0x0f || this.readUInt8();
    return (type << 16) | nth;
  }

  /*
   * @brief: Return the Field assaciated with the head of the parser
   */
  readField(): FieldInstance {
    return Field.fromString(this.readFieldOrdinal().toString());
  }

  /*
   * @brief: Reads the given type from the head of the parser
   */
  readType(type) {
    // Returns a serializedType, will type when implimented
    return type.fromParser(this);
  }

  /*
   * @brief: Returns the type associated with a given field
   */
  typeForField(field: FieldInstance) {
    //same
    return field.associatedType;
  }

  /*
   * @brief: Read the value associted with a given field
   */
  readFieldValue(field: FieldInstance) {
    // same
    const kls = this.typeForField(field);
    if (!kls) {
      throw new Error(`unsupported: (${field.name}, ${field.type.name})`);
    }
    const sizeHint = field.isVariableLengthEncoded ? this.readVLLength() : null;
    const value = kls.fromParser(this, sizeHint);
    if (value === undefined) {
      throw new Error(
        `fromParser for (${field.name}, ${field.type.name}) -> undefined `
      );
    }
    return value;
  }

  /*
   * @brief: read both the field and the cooresponding value form the binary parser
   */
  readFieldAndValue() {
    // same
    const field = this.readField();
    return [field, this.readFieldValue(field)];
  }
}

export { BinaryParser };
