import * as assert from "assert";
import { coreTypes } from "./types";
import { quality, binary } from "./coretypes";
const {
  signingData,
  signingClaimData,
  multiSigningData,
  binaryToJSON,
  serializeObject,
  BinaryParser,
} = binary;

function decodeLedgerData(binary: string): any {
  assert(typeof binary === "string", "binary must be a hex string");
  const parser = new BinaryParser(binary);
  return {
    ledger_index: parser.readUInt32(),
    total_coins: parser.readType(coreTypes.UInt64).valueOf().toString(),
    parent_hash: parser.readType(coreTypes.Hash256).toHex(),
    transaction_hash: parser.readType(coreTypes.Hash256).toHex(),
    account_hash: parser.readType(coreTypes.Hash256).toHex(),
    parent_close_time: parser.readUInt32(),
    close_time: parser.readUInt32(),
    close_time_resolution: parser.readUInt8(),
    close_flags: parser.readUInt8(),
  };
}

function decode(binary: string): Record<string, any> {
  assert(typeof binary === "string", "binary must be a hex string");
  return binaryToJSON(binary);
}

function encode(json: string): string {
  assert(typeof json === "object");
  return serializeObject(json).toString("hex").toUpperCase();
}

function encodeForSigning(json: any): string {
  assert(typeof json === "object");
  return signingData(json).toString("hex").toUpperCase();
}

function encodeForSigningClaim(json): string {
  assert(typeof json === "object");
  return signingClaimData(json).toString("hex").toUpperCase();
}

function encodeForMultisigning(json, signer): string {
  assert(typeof json === "object");
  assert.equal(json.SigningPubKey, "");
  return multiSigningData(json, signer).toString("hex").toUpperCase();
}

function encodeQuality(value: string): string {
  assert(typeof value === "string");
  return quality.encode(value).toString("hex").toUpperCase();
}

function decodeQuality(value: string): string {
  assert(typeof value === "string");
  return quality.decode(value).toString();
}

module.exports = {
  decode,
  encode,
  encodeForSigning,
  encodeForSigningClaim,
  encodeForMultisigning,
  encodeQuality,
  decodeQuality,
  decodeLedgerData,
};
