import * as assert from "assert";
import { Field, FieldInstance } from "../definitions";

class BytesList {
  arrays: Array<Buffer> = [];
  length: number = 0;
    
  put(bytesArg: Buffer): BytesList {
    let bytes = Buffer.from(bytesArg) // Temporary, to catch isntances of Uint8Array being passed in
    this.length += bytes.byteLength;
    this.arrays.push(bytes);
    return this;
  }

  toBytesSink(sink: BytesList): void {
    sink.put(this.toBytes());
  }

  toBytes(): Buffer {
    return Buffer.concat(this.arrays)
  }

  toHex(): string {
    return this.toBytes().toString('hex').toUpperCase();
  }
}

class BinarySerializer {
  sink: BytesList = new BytesList()

  constructor(sink: BytesList) {
    this.sink = sink;
  }

  write(value): void {
    value.toBytesSink(this.sink);
  }

  put(bytes: Buffer): void {
    this.sink.put(bytes);
  }

  writeType(type, value): void {
    this.write(type.from(value));
  }

  writeBytesList(bl: BytesList): void {
    bl.toBytesSink(this.sink);
  }

  encodeVL(len: number): Buffer {
    let length = len;
    const lenBytes = Buffer.alloc(3);
    if (length <= 192) {
      lenBytes[0] = length;
      return lenBytes.slice(0, 1);
    } else if (length <= 12480) {
      length -= 193;
      lenBytes[0] = 193 + (length >>> 8);
      lenBytes[1] = length & 0xff;
      return lenBytes.slice(0, 2);
    } else if (length <= 918744) {
      length -= 12481;
      lenBytes[0] = 241 + (length >>> 16);
      lenBytes[1] = (length >> 8) & 0xff;
      lenBytes[2] = length & 0xff;
      return lenBytes.slice(0, 3);
    }
    throw new Error("Overflow error");
  }

  writeFieldAndValue(field: FieldInstance, _value): void {
    const value = field.associatedType.from(_value);
    assert(value.toBytesSink, field.name);
    this.sink.put(field.header);

    if (field.isVariableLengthEncoded) {
      this.writeLengthEncoded(value);
    } else {
      value.toBytesSink(this.sink);
      if (field.type.name === "STObject") {
        this.sink.put(Field["ObjectEndMarker"].header);
      } else if (field.type.name === "STArray") {
        this.sink.put(Field["ArrayEndMarker"].header);
      }
    }
  }

  writeLengthEncoded(value): void {
    const bytes = new BytesList();
    value.toBytesSink(bytes);
    this.put(this.encodeVL(bytes.length));
    this.writeBytesList(bytes);
  }
}

export { BytesList, BinarySerializer };
