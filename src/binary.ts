import * as bigInt from 'big-integer'
import { Buffer } from 'buffer/'

import { FieldInstance } from './enums'
import HashPrefix from './hash-prefixes'
import { sha512Half, transactionID } from './hashes'
import BinaryParser from './serdes/BinaryParser'
import BinarySerializer from './serdes/BinarySerializer'
import BytesList from './serdes/BytesList'
import { AccountID, Hash256, STObject, UInt64 } from './types'
import { JsonObject } from './types/SerializedType'

/**
 * Construct a BinaryParser.
 *
 * @param bytes - Hex-string to construct BinaryParser from.
 * @returns A BinaryParser.
 */
const makeParser = (bytes: string): BinaryParser => new BinaryParser(bytes)

/**
 * Parse BinaryParser into JSON.
 *
 * @param parser - BinaryParser object.
 * @returns JSON for the bytes in the BinaryParser.
 */
const readJSON = (parser: BinaryParser): JsonObject =>
  (parser.readType(STObject) as STObject).toJSON()

/**
 * Parse a hex-string into its JSON interpretation.
 *
 * @param bytes - Hex-string to parse into JSON.
 * @returns JSON.
 */
const binaryToJSON = (bytes: string): JsonObject => readJSON(makeParser(bytes))

/**
 * Interface for passing parameters to SerializeObject.
 *
 * @property set - SigningFieldOnly to true if you want to serialize only signing fields.
 */
interface OptionObject {
  prefix?: Buffer
  suffix?: Buffer
  signingFieldsOnly?: boolean
}

/**
 * Function to serialize JSON object representing a transaction.
 *
 * @param object - JSON object to serialize.
 * @param opts - Options for serializing, including optional prefix, suffix, and signingFieldOnly.
 * @returns A Buffer containing the serialized object.
 */
function serializeObject(object: JsonObject, opts: OptionObject = {}): Buffer {
  const { prefix, suffix, signingFieldsOnly = false } = opts
  const bytesList = new BytesList()

  if (prefix) {
    bytesList.put(prefix)
  }

  const filter = signingFieldsOnly
    ? (field: FieldInstance): boolean => field.isSigningField
    : undefined
  STObject.from(object, filter).toBytesSink(bytesList)

  if (suffix) {
    bytesList.put(suffix)
  }

  return bytesList.toBytes()
}

/**
 * Serialize an object for signing.
 *
 * @param transaction - Transaction to serialize.
 * @param prefix - Prefix bytes to put before the serialized object.
 * @returns A Buffer with the serialized object.
 */
function signingData(
  transaction: JsonObject,
  prefix: Buffer = HashPrefix.transactionSig,
): Buffer {
  return serializeObject(transaction, { prefix, signingFieldsOnly: true })
}

/**
 * Interface describing fields required for a Claim.
 */
interface ClaimObject extends JsonObject {
  channel: string
  amount: string | number
}

/**
 * Serialize a signingClaim.
 *
 * @param claim - A claim object to serialize.
 * @returns The serialized object with appropriate prefix.
 */
function signingClaimData(claim: ClaimObject): Buffer {
  const num = bigInt(String(claim.amount))
  const prefix = HashPrefix.paymentChannelClaim
  const channel = Hash256.from(claim.channel).toBytes()
  const amount = UInt64.from(num).toBytes()

  const bytesList = new BytesList()

  bytesList.put(prefix)
  bytesList.put(channel)
  bytesList.put(amount)
  return bytesList.toBytes()
}

/**
 * Serialize a transaction object for multiSigning.
 *
 * @param transaction - Transaction to serialize.
 * @param signingAccount - Account to sign the transaction with.
 * @returns Serialized transaction with appropriate prefix and suffix.
 */
function multiSigningData(
  transaction: JsonObject,
  signingAccount: string | AccountID,
): Buffer {
  const prefix = HashPrefix.transactionMultiSig
  const suffix = AccountID.from(signingAccount).toBytes()
  return serializeObject(transaction, {
    prefix,
    suffix,
    signingFieldsOnly: true,
  })
}

export {
  BinaryParser,
  BinarySerializer,
  BytesList,
  ClaimObject,
  makeParser,
  serializeObject,
  readJSON,
  multiSigningData,
  signingData,
  signingClaimData,
  binaryToJSON,
  sha512Half,
  transactionID,
}
