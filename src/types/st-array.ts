import { SerializedTypeClass } from "./serialized-type";
import { STObject } from "./st-object";
import { BinaryParser } from "../serdes/binary-parser";

const ARRAY_END_MARKER = 0xF1;
const OBJECT_END_MARKER = 0xE1;

class STArray extends SerializedTypeClass {

  constructor(bytes: Buffer) {
    super(bytes);
  }

  static fromParser(parser: BinaryParser): STArray {
    let bytes: Array<Buffer> = []

    while (!parser.end()) {
      const field = parser.readField();
      if (field.name === "ArrayEndMarker") {
        break;
      }

      bytes.push(field.header, parser.readFieldValue(field).toBytes(), Buffer.from([OBJECT_END_MARKER]))
    }

    bytes.push(Buffer.from([ARRAY_END_MARKER]))
    return new STArray(Buffer.concat(bytes));
  }

  static from(value: STArray | Array<object>): STArray {
    if(value instanceof STArray) {
      return value;
    }

    let bytes: Array<Buffer> = []
    value.forEach(obj => {
      bytes.push(STObject.from(obj).toBytes())
    })

    bytes.push(Buffer.from([ARRAY_END_MARKER]))
    return new STArray(Buffer.concat(bytes));
  }

  toJSON(): Array<object> {
    let result: Array<object> = [];

    let arrayParser = new BinaryParser(this.toString())

    while(!arrayParser.end()) {
      const field = arrayParser.readField();
      if(field.name === "ArrayEndMarker") {
        break;
      }

      const outer = {};
      outer[field.name] = STObject.fromParser(arrayParser).toJSON()
      result.push(outer);
    }

    return result;
  }
}

export { STArray };
