import { serializeUIntN } from "./../utils/bytes-utils";
import * as enums from "./definitions.json";

const TYPE_WIDTH = 2;
const LEDGER_ENTRY_WIDTH = 2;
const TXN_TYPE_WIDTH = 2;
const TXN_RESULT_WIDTH = 1;

class EnumType {
  bytes: Uint8Array;

  constructor(
    public name: string,
    public ordinal: number,
    public ordinalWidth: number
  ) {
    this.bytes = serializeUIntN(ordinal, ordinalWidth);
  }

  toJSON(): string {
    return this.name;
  }

  toBytesSink(sink): void {
    sink.put(this.bytes);
  }
}

class EnumTypes {
  constructor(types: { [key: string]: number }, public ordinalWidth: number) {
    Object.entries(types).forEach(([k, v]) => {
      this[k] = new EnumType(k, v, ordinalWidth);
      this[v.toString()] = this[k];
    });
  }

  from(value: EnumType | string): EnumType {
    return value instanceof EnumType ? value : (this[value] as EnumType);
  }

  fromParser(parser): EnumType {
    return this.from(parser.readUIntN(this.ordinalWidth).toString());
  }
}

type FieldInfo = {
  nth: number;
  isVLEncoded: boolean;
  isSerialized: boolean;
  isSigningField: boolean;
  type: string;
};

class Field {
  nth: number;
  isVLEncoded: boolean;
  isSerialized: boolean;
  isSigningField: boolean;
  type: EnumType;
  ordinal: number;
  name: string;
  bytes: Uint8Array;
  associatedType: any; // Will change this to type CoreType when CoreType is refactored

  constructor([name, info]: [string, FieldInfo]) {
    this.name = name;
    this.nth = info.nth;
    this.isVLEncoded = info.isVLEncoded;
    this.isSerialized = info.isSerialized;
    this.isSigningField = info.isSigningField;
    const typeOrdinal = enums.TYPES[info.type];
    this.ordinal = (typeOrdinal << 16) | info.nth;
    this.type = new EnumType(info.type, typeOrdinal, TYPE_WIDTH);
    this.bytes = this.header(typeOrdinal, info.nth);
    this.associatedType = undefined; // For later assignment in ./types/index.js
  }

  header(type: number, nth: number): Uint8Array {
    const header: Array<number> = [];
    if (type < 16) {
      if (nth < 16) {
        header.push((type << 4) | nth);
      } else {
        header.push(type << 4, nth);
      }
    } else if (nth < 16) {
      header.push(nth, type);
    } else {
      header.push(0, type, nth);
    }
    return new Uint8Array(header);
  }

  toJSON(): string {
    return this.name;
  }
}

class Fields {
  constructor(fields: Array<[string, FieldInfo]>) {
    fields.forEach(([k, v]) => {
      this[k] = new Field([k, v]);
      this[this[k].ordinal.toString()] = this[k];
    });
  }

  from(value: Field | string): Field {
    return value instanceof Field ? value : (this[value] as Field);
  }
}

interface EnumInterface {
  TYPES: { [key: string]: number };
  FIELDS: Array<[string, FieldInfo]>;
  LEDGER_ENTRY_TYPES: { [key: string]: number };
  TRANSACTION_TYPES: { [key: string]: number };
  TRANSACTION_RESULTS: { [key: string]: number };
}

class Enum {
  Type: EnumTypes;
  Field: Fields;
  LedgerEntryType: EnumTypes;
  TransactionType: EnumTypes;
  TransactionResult: EnumTypes;

  constructor(initVals: EnumInterface) {
    this.Type = new EnumTypes(initVals.TYPES, TYPE_WIDTH);
    this.LedgerEntryType = new EnumTypes(
      initVals.LEDGER_ENTRY_TYPES,
      LEDGER_ENTRY_WIDTH
    );
    this.TransactionType = new EnumTypes(
      initVals.TRANSACTION_TYPES,
      TXN_TYPE_WIDTH
    );
    this.TransactionResult = new EnumTypes(
      initVals.TRANSACTION_RESULTS,
      TXN_RESULT_WIDTH
    );
    this.Field = new Fields(initVals.FIELDS);
  }
}

const Enums = new Enum({
  TYPES: enums.TYPES,
  FIELDS: enums.FIELDS as Array<[string, FieldInfo]>,
  LEDGER_ENTRY_TYPES: enums.LEDGER_ENTRY_TYPES,
  TRANSACTION_TYPES: enums.TRANSACTION_TYPES,
  TRANSACTION_RESULTS: enums.TRANSACTION_RESULTS,
});

export { Enums };
