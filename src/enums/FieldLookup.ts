/* eslint-disable no-bitwise -- this file needs to use bitwise operations */
import { Buffer } from 'buffer/'

import * as types from '../types'

import Bytes from './Bytes'
import BytesLookup from './BytesLookup'
import * as enums from './definitions.json'
import FieldInfo from './FieldInfo'
import FieldInstance from './FieldInstance'

const TYPE_WIDTH = 2
const LEDGER_ENTRY_WIDTH = 2
export const LedgerEntryType = new BytesLookup(
  enums.LEDGER_ENTRY_TYPES,
  LEDGER_ENTRY_WIDTH,
)

const TRANSACTION_TYPE_WIDTH = 2
export const TransactionType = new BytesLookup(
  enums.TRANSACTION_TYPES,
  TRANSACTION_TYPE_WIDTH,
)

const TRANSACTION_RESULT_WIDTH = 1
export const TransactionResult = new BytesLookup(
  enums.TRANSACTION_RESULTS,
  TRANSACTION_RESULT_WIDTH,
)

// NOTE: this is strange. Here we are making LedgerEntryType, TransactionType,
// and TransactionResult use the above instances of BytesLookup instead of
// their specified type. This is a strange violation of type safety and needs
// refactoring.
/* eslint-disable @typescript-eslint/naming-convention --
 * TODO maybe allow this in the general @xrplf/eslint-config because this is
 * OK */
const TYPE_MAP = {
  ...types,
  LedgerEntryType,
  TransactionType,
  TransactionResult,
}
/* eslint-enable @typescript-eslint/naming-convention */

// @brief: Serialize a field based on type_code and Field.nth
/* eslint-disable @typescript-eslint/no-magic-numbers --
 * TODO describe this better */
function fieldHeader(type: number, nth: number): Buffer {
  const header: number[] = []
  if (type < 16) {
    if (nth < 16) {
      header.push((type << 4) | nth)
    } else {
      header.push(type << 4, nth)
    }
  } else if (nth < 16) {
    header.push(nth, type)
  } else {
    header.push(0, type, nth)
  }
  return Buffer.from(header)
}
/* eslint-enable @typescript-eslint/no-magic-numbers */

function buildField([name, info]: [string, FieldInfo]): FieldInstance {
  /* eslint-disable @typescript-eslint/consistent-type-assertions --
   * this is ok since it's being parsed from JSON and we know what's there */
  const typeOrdinal = enums.TYPES[info.type] as number
  /* eslint-enable @typescript-eslint/consistent-type-assertions */
  /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-magic-numbers --
   * TODO the associated type here is actually either a constructor that
   * inherits from SerializedType or an instance of BytesLookup. Needs refactor. */
  return {
    name,
    nth: info.nth,
    isVariableLengthEncoded: info.isVLEncoded,
    isSerialized: info.isSerialized,
    isSigningField: info.isSigningField,
    ordinal: (typeOrdinal << 16) | info.nth,
    type: new Bytes(info.type, typeOrdinal, TYPE_WIDTH),
    header: fieldHeader(typeOrdinal, info.nth),
    associatedType: TYPE_MAP[name] ?? TYPE_MAP[info.type],
  }
  /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-magic-numbers */
}

interface FieldLookupStore {
  [key: string]: FieldInstance
}

// @brief: The collection of all fields as defined in definitions.json
export default class FieldLookup {
  private readonly _store: FieldLookupStore

  public constructor(fields: Array<[string, FieldInfo]>) {
    this._store = {}
    fields.forEach(([key, value]) => {
      const field = buildField([key, value])
      this._store[key] = field
      this._store[field.ordinal.toString()] = field
    })
  }

  public get(value: string): FieldInstance {
    return this._store[value]
  }
}
