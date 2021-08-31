import * as enums from './definitions.json'
import FieldInfo from './FieldInfo'
import FieldLookup from './FieldLookup'

export default new FieldLookup(enums.FIELDS as Array<[string, FieldInfo]>)
