import type { Buffer } from 'buffer/'

import type SerializedType from '../types/SerializedType'

import type Bytes from './Bytes'

export default interface FieldInstance {
  readonly nth: number
  readonly isVariableLengthEncoded: boolean
  readonly isSerialized: boolean
  readonly isSigningField: boolean
  readonly type: Bytes
  readonly ordinal: number
  readonly name: string
  readonly header: Buffer
  // TODO: this isn't true since in `src/enums/FieldLookup` we assign some cases to instances of ByteLookup....
  associatedType: typeof SerializedType
}
