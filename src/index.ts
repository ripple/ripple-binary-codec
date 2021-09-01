import * as assert from 'assert'

import {
  ClaimObject,
  signingData,
  signingClaimData,
  multiSigningData,
  binaryToJSON,
  serializeObject,
} from './binary'
import { decodeLedgerData } from './ledger-hashes'
import { quality } from './quality'
import { JsonObject } from './types/SerializedType'

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

  /* eslint-disable @typescript-eslint/consistent-type-assertions --
   * TODO why is this necessary maybe it's not */
  return serializeObject(json as JsonObject)
    .toString('hex')
    .toUpperCase()
  /* eslint-enable @typescript-eslint/consistent-type-assertions */
}

/**
 * Encode a transaction and prepare for signing.
 *
 * @param json - JSON object representing the transaction.
 * @returns A hex string of the encoded transaction.
 */
function encodeForSigning(json: Record<string, unknown>): string {
  assert(typeof json === 'object')

  /* eslint-disable @typescript-eslint/consistent-type-assertions --
   * TODO why is this necessary maybe it's not */
  return signingData(json as JsonObject)
    .toString('hex')
    .toUpperCase()
  /* eslint-enable @typescript-eslint/consistent-type-assertions */
}

/**
 * Encode a transaction and prepare for signing with a claim.
 *
 * @param json - JSON object representing the transaction.
 * @returns A hex string of the encoded transaction.
 */
function encodeForSigningClaim(json: Record<string, unknown>): string {
  assert(typeof json === 'object')

  /* eslint-disable @typescript-eslint/consistent-type-assertions --
   * TODO why is this necessary maybe it's not */
  return signingClaimData(json as ClaimObject)
    .toString('hex')
    .toUpperCase()
  /* eslint-enable @typescript-eslint/consistent-type-assertions */
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

  /* eslint-disable @typescript-eslint/consistent-type-assertions --
   * TODO why is this necessary maybe it's not */
  return multiSigningData(json as JsonObject, signer)
    .toString('hex')
    .toUpperCase()
  /* eslint-enable @typescript-eslint/consistent-type-assertions */
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
