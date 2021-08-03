import * as assert from "assert";
import { quality, binary } from "./coretypes";
import { decodeLedgerData } from "./ledger-hashes";
import { ClaimObject } from "./binary";
import { XrpLedgerEntry } from "./types/ledger-entries";
import { XrpLedgerTransaction } from "./types/transactions";
import { JsonObject } from "./types/serialized-type";

const {
  signingData,
  signingClaimData,
  multiSigningData,
  binaryToJSON,
  serializeObject,
} = binary;

type XrplJson = XrpLedgerEntry | XrpLedgerTransaction;

/**
 * A quick note on the Double Assertions ((as unknown) as JsonObject) below:
 *
 * Yes, they are ugly, I'm aware, but the casts from XrplJson to JsonObject will
 * always produce valid JsonObjects. Why, you may ask? JsonObject is a recursive
 * Json definition, and XrplJson, being a typescript interface, is a subset of
 * all possible json objects. Hence, this casting is valid.
 *
 * When casting back to XrplJson in decode, we trust that the user will pass in
 * a generic that appropriately types the function.
 *
 * Still ugly, though.
 */

/**
 * Decode a transaction
 *
 * @param binary hex-string of the encoded transaction
 * @returns the JSON representation of the transaction
 */
function decode<T extends XrplJson>(binary: string): T {
  assert(typeof binary === "string", "binary must be a hex string");
  return (binaryToJSON(binary) as unknown) as T;
}

/**
 * Encode a transaction
 *
 * @param json The JSON representation of a transaction
 * @returns A hex-string of the encoded transaction
 */
function encode(json: XrplJson): string {
  assert(typeof json === "object");

  const toEncode = (json as unknown) as JsonObject;
  return serializeObject(toEncode).toString("hex").toUpperCase();
}

/**
 * Encode a transaction and prepare for signing
 *
 * @param json JSON object representing the transaction
 * @param signer string representing the account to sign the transaction with
 * @returns a hex string of the encoded transaction
 */
function encodeForSigning(json: XrplJson): string {
  assert(typeof json === "object");

  const signing = (json as unknown) as ClaimObject;
  return signingData(signing).toString("hex").toUpperCase();
}

/**
 * Encode a transaction and prepare for signing with a claim
 *
 * @param json JSON object representing the transaction
 * @param signer string representing the account to sign the transaction with
 * @returns a hex string of the encoded transaction
 */
function encodeForSigningClaim(json: XrplJson): string {
  assert(typeof json === "object");

  const claim = (json as unknown) as ClaimObject;
  return signingClaimData(claim).toString("hex").toUpperCase();
}

/**
 * Encode a transaction and prepare for multi-signing
 *
 * @param json JSON object representing the transaction
 * @param signer string representing the account to sign the transaction with
 * @returns a hex string of the encoded transaction
 */
function encodeForMultisigning(json: XrplJson, signer: string): string {
  assert(typeof json === "object");
  assert(json["SigningPubKey"] == "");

  const obj: JsonObject = (json as unknown) as JsonObject;
  return multiSigningData(obj, signer).toString("hex").toUpperCase();
}

/**
 * Encode a quality value
 *
 * @param value string representation of a number
 * @returns a hex-string representing the quality
 */
function encodeQuality(value: string): string {
  assert(typeof value === "string");
  return quality.encode(value).toString("hex").toUpperCase();
}

/**
 * Decode a quality value
 *
 * @param value hex-string of a quality
 * @returns a string representing the quality
 */
function decodeQuality(value: string): string {
  assert(typeof value === "string");
  return quality.decode(value).toString();
}

export {
  decode,
  encode,
  encodeForSigning,
  encodeForSigningClaim,
  encodeForMultisigning,
  encodeQuality,
  decodeQuality,
  decodeLedgerData,
};
