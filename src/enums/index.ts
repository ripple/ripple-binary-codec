import * as enums from './definitions.json'
import FieldInfo from './FieldInfo'
import FieldInstance from './FieldInstance'
import FieldLookup, {
  Type,
  LedgerEntryType,
  TransactionType,
  TransactionResult,
} from './FieldLookup'

const Field = new FieldLookup(enums.FIELDS as Array<[string, FieldInfo]>)

export {
  Field,
  FieldInstance,
  Type,
  LedgerEntryType,
  TransactionResult,
  TransactionType,
}
