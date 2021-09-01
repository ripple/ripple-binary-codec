import * as enums from './definitions.json'
import FieldInfo from './FieldInfo'
import FieldLookup from './FieldLookup'

/* eslint-disable @typescript-eslint/consistent-type-assertions --
 * this is ok since we're parsing JSON and we know what's there */
export default new FieldLookup(enums.FIELDS as Array<[string, FieldInfo]>)
/* eslint-enable @typescript-eslint/consistent-type-assertions */
