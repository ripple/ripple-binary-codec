import { serializeUIntN } from "./../utils/bytes-utils";
import * as enums from "./definitions.json";

const TYPE_WIDTH = 2;
const LEDGER_ENTRY_WIDTH = 2;
const TRANSACTION_TYPE_WIDTH = 2;
const TRANSACTION_RESULT_WIDTH = 1;

/*
 * @brief: Serialize a field based on type_code and Field.nth
 */
function fieldHeader(type: number, nth: number): Uint8Array {
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

/*
 * @brief: Bytes, name, and ordinal representing one type, ledger_type, transaction type, or result
 */
class Bytes {
  readonly bytes: Uint8Array;

  constructor(
    readonly name: string,
    readonly ordinal: number,
    readonly ordinalWidth: number
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

/*
 * @brief: Collection of Bytes objects, mapping bidirectionally
 */
class BytesCollection {
  constructor(types: { [key: string]: number }, readonly ordinalWidth: number) {
    Object.entries(types).forEach(([k, v]) => {
      this[k] = new Bytes(k, v, ordinalWidth);
      this[v.toString()] = this[k];
    });
  }

  from(value: Bytes | string): Bytes {
    return value instanceof Bytes ? value : (this[value] as Bytes);
  }

  fromParser(parser): Bytes {
    return this.from(parser.readUIntN(this.ordinalWidth).toString());
  }
}

/*
 * type FieldInfo is the type of the objects constaining information about each field in definitions.json
 */
type FieldInfo = {
  nth: number;
  isVLEncoded: boolean;
  isSerialized: boolean;
  isSigningField: boolean;
  type: string;
};

type Field = {
  readonly nth: number;
  readonly isVLEncoded: boolean;
  readonly isSerialized: boolean;
  readonly isSigningField: boolean;
  readonly type: Bytes;
  readonly ordinal: number;
  readonly name: string;
  readonly header: Uint8Array;
  readonly associatedType: any;
};

function buildField([name, info]: [string, FieldInfo]): Field {
  const typeOrdinal = enums.TYPES[info.type];
  return {
    name: name,
    nth: info.nth,
    isVLEncoded: info.isVLEncoded,
    isSerialized: info.isSerialized,
    isSigningField: info.isSigningField,
    ordinal: (typeOrdinal << 16) | info.nth,
    type: new Bytes(info.type, typeOrdinal, TYPE_WIDTH),
    header: fieldHeader(typeOrdinal, info.nth),
    associatedType: undefined, // For later assignment in ./types/index.js
  };
}

/*
 * @brief: The collection of all fields as defined in definitons.json
 */
class Fields {
  constructor(fields: Array<[string, FieldInfo]>) {
    fields.forEach(([k, v]) => {
      this[k] = buildField([k, v]);
      this[this[k].ordinal.toString()] = this[k];
    });
  }

  fromString(value: string): Field {
    return this[value] as Field;
  }
}

interface EnumInterface {
  TYPES: { [key: string]: number };
  FIELDS: Array<[string, FieldInfo]>;
  LEDGER_ENTRY_TYPES: { [key: string]: number };
  TRANSACTION_TYPES: { [key: string]: number };
  TRANSACTION_RESULTS: { [key: string]: number };
}

type Enum = {
  readonly Type: BytesCollection;
  readonly Field: Fields;
  readonly LedgerEntryType: BytesCollection;
  readonly TransactionType: BytesCollection;
  readonly TransactionResult: BytesCollection;
};

function buildEnums(initVals: EnumInterface): Enum {
  return {
    Type: new BytesCollection(initVals.TYPES, TYPE_WIDTH),
    LedgerEntryType: new BytesCollection(
      initVals.LEDGER_ENTRY_TYPES,
      LEDGER_ENTRY_WIDTH
    ),
    TransactionType: new BytesCollection(
      initVals.TRANSACTION_TYPES,
      TRANSACTION_TYPE_WIDTH
    ),
    TransactionResult: new BytesCollection(
      initVals.TRANSACTION_RESULTS,
      TRANSACTION_RESULT_WIDTH
    ),
    Field: new Fields(initVals.FIELDS),
  };
}

const Enums: Enum = buildEnums({
  TYPES: enums.TYPES,
  FIELDS: enums.FIELDS as Array<[string, FieldInfo]>,
  LEDGER_ENTRY_TYPES: enums.LEDGER_ENTRY_TYPES,
  TRANSACTION_TYPES: enums.TRANSACTION_TYPES,
  TRANSACTION_RESULTS: enums.TRANSACTION_RESULTS,
});

export { Enums };
