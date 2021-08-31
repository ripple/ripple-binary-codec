import * as assert from 'assert'

import { ClaimObject } from './binary'
import { quality, binary } from './coretypes'
import { decodeLedgerData } from './ledger-hashes'
import { JsonObject } from './types/SerializedType'

const {
  signingData,
  signingClaimData,
  multiSigningData,
  binaryToJSON,
  serializeObject,
} = binary

/**
 * Decode a transaction.
 *
 * @param hexString - Hex-string of the encoded transaction.
 * @returns The JSON representation of the transaction.
 */
function decode(hexString: string): JsonObject {
  assert(typeof hexString === 'string', 'argument must be a hex string')
  return binaryToJSON(hexString)
}

/**
 * Encode a transaction.
 *
 * @param json - The JSON representation of a transaction.
 * @returns A hex-string of the encoded transaction.
 */
function encode(json: Record<string, unknown>): string {
  assert(typeof json === 'object')
  return serializeObject(json as JsonObject)
    .toString('hex')
    .toUpperCase()
}

/**
 * Encode a transaction and prepare for signing.
 *
 * @param json - JSON object representing the transaction.
 * @returns A hex string of the encoded transaction.
 */
function encodeForSigning(json: Record<string, unknown>): string {
  assert(typeof json === 'object')
  return signingData(json as JsonObject)
    .toString('hex')
    .toUpperCase()
}

/**
 * Encode a transaction and prepare for signing with a claim.
 *
 * @param json - JSON object representing the transaction.
 * @returns A hex string of the encoded transaction.
 */
function encodeForSigningClaim(json: Record<string, unknown>): string {
  assert(typeof json === 'object')
  return signingClaimData(json as ClaimObject)
    .toString('hex')
    .toUpperCase()
}

/**
 * Encode a transaction and prepare for multi-signing.
 *
 * @param json - JSON object representing the transaction.
 * @param signer - String representing the account to sign the transaction with.
 * @returns A hex string of the encoded transaction.
 */
function encodeForMultisigning(
  json: Record<string, unknown>,
  signer: string,
): string {
  assert(typeof json === 'object')
  assert.equal(json.SigningPubKey, '')
  return multiSigningData(json as JsonObject, signer)
    .toString('hex')
    .toUpperCase()
}

/**
 * Encode a quality value.
 *
 * @param value - String representation of a number.
 * @returns A hex-string representing the quality.
 */
function encodeQuality(value: string): string {
  assert(typeof value === 'string')
  return quality.encode(value).toString('hex').toUpperCase()
}

/**
 * Decode a quality value.
 *
 * @param value - Hex-string of a quality.
 * @returns A string representing the quality.
 */
function decodeQuality(value: string): string {
  assert(typeof value === 'string')
  return quality.decode(value).toString()
}

export = {
  decode,
  encode,
  encodeForSigning,
  encodeForSigningClaim,
  encodeForMultisigning,
  encodeQuality,
  decodeQuality,
  decodeLedgerData,
}
