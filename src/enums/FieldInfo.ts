// type FieldInfo is the type of the objects containing information about each field in definitions.json
export default interface FieldInfo {
  nth: number
  isVLEncoded: boolean
  isSerialized: boolean
  isSigningField: boolean
  type: string
}
