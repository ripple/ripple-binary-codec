import { SerializedTypeClass } from "./serialized-type";
import { STObject } from "./st-object";
import { BinaryParser } from "../serdes/binary-parser";

const ARRAY_END_MARKER = 0xF1;

class STArray extends SerializedTypeClass {

  constructor(bytes: Buffer) {
    super(bytes);
  }

  static fromParser(parser: BinaryParser): STArray {
    let bytes: Array<Buffer> = []

    while (!parser.end()) {
      const field = parser.readField();
      if (field.name === "ArrayEndMarker") {
        bytes.push(Buffer.from([ARRAY_END_MARKER]))
        break;
      }
      bytes.push(field.header, parser.readFieldValue(field).toBytes())
    }

    return new STArray(Buffer.concat(bytes));
  }

  static from(value: STArray | Array<object>): STArray {
    if(value instanceof STArray) {
      return value;
    }

    let bytes: Array<Buffer> = []

    value.forEach(obj => {
      bytes.push(STObject.from(obj).toBytes());
    })

    return new STArray(Buffer.concat(bytes));
  }

  toJSON(): Array<object> {
    let result: Array<object> = [];

    let arrayParser = new BinaryParser(this.toString())

    while(!arrayParser.end()) {
      console.log(arrayParser);
      if(arrayParser.peek() === ARRAY_END_MARKER) {
        arrayParser.read(1);
        break;
      }
      result.push(STObject.fromParser(arrayParser).toJSON())
    }

    return result;
  }
}

export { STArray };
