import { Field } from "../enums";
import { SerializedTypeClass } from "./serialized-type";
import { BinaryParser } from "../serdes/binary-parser";
import { BinarySerializer, BytesList } from "../serdes/binary-serializer";

const OBJECT_END_MARKER = Buffer.from([0xe1]);

class STObject extends SerializedTypeClass {
  
  static fromParser(parser: BinaryParser): STObject {
    let list: BytesList = new BytesList();
    let bytes: BinarySerializer = new BinarySerializer(list)

    while (!parser.end()) {
      const field = parser.readField();
      if (field.name === "ObjectEndMarker") {
        break;
      }

      const associatedValue = parser.readFieldValue(field);

      bytes.writeFieldAndValue(field, associatedValue);
      if(field.type.name === "STObject") {
        bytes.put(OBJECT_END_MARKER)
      }
    }
    
    return new STObject(list.toBytes());
  }

  static from(value: STObject | object, filter?: (string) => boolean): STObject {
    if (value instanceof STObject) {
      return value;
    }

    let list: BytesList = new BytesList();
    let bytes: BinarySerializer = new BinarySerializer(list)

    let sorted = Object.keys(value)
      .map(f => Field[f])
      .filter(f => f !== undefined && f.isSerialized)
      .sort((a, b) => {
      return a.ordinal - b.ordinal
    })

    if(filter !== undefined) {
      sorted = sorted.filter(filter);
    }

    sorted.forEach((field) => {
      const associatedValue = field.associatedType.from(value[field.name]);

      bytes.writeFieldAndValue(field, associatedValue);
      if(field.type.name === "STObject") {
        bytes.put(OBJECT_END_MARKER)
      }
    })

    return new STObject(list.toBytes())
  }

  toJSON(): object {
    let objectParser = new BinaryParser(this.toString());
    const accumulator = {};

    while(!objectParser.end()) {
      const field = objectParser.readField();
      if(field.name === "ObjectEndMarker") {
        break;
      }
      accumulator[field.name] = objectParser.readFieldValue(field).toJSON();
    }

    return accumulator;
  }
}

export { STObject };
