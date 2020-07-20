/* eslint-disable func-style */

import { coreTypes } from "./types";
import { BinaryParser } from "./serdes/binary-parser";
import { AccountID } from "./types/account-id";
import { HashPrefix } from "./hash-prefixes";
import { BinarySerializer, BytesList } from "./serdes/binary-serializer";
import { sha512Half, transactionID } from "./hashes";
import { FieldInstance } from "./enums";

const makeParser = (bytes: string): BinaryParser => new BinaryParser(bytes);
const readJSON = (parser: BinaryParser): any =>
  parser.readType(coreTypes.STObject).toJSON();
const binaryToJSON = (bytes: string): any => readJSON(makeParser(bytes));

interface OptionObject {
  prefix?: Buffer;
  suffix?: Buffer;
  signingFieldsOnly?: boolean;
}

function serializeObject(object: any, opts: OptionObject = {}): Buffer {
  const { prefix, suffix, signingFieldsOnly = false } = opts;
  const bytesList = new BytesList();

  if (prefix) {
    bytesList.put(prefix);
  }

  const filter = signingFieldsOnly
    ? (f: FieldInstance): boolean => f.isSigningField
    : undefined;
  coreTypes.STObject.from(object, filter).toBytesSink(bytesList);

  if (suffix) {
    bytesList.put(suffix);
  }

  return bytesList.toBytes();
}

function signingData(
  tx: any,
  prefix: Buffer = HashPrefix.transactionSig
): Buffer {
  return serializeObject(tx, { prefix, signingFieldsOnly: true });
}

interface ClaimObject {
  channel: string;
  amount: string | number | bigint;
}
function signingClaimData(claim: ClaimObject): Buffer {
  const prefix = HashPrefix.paymentChannelClaim;
  const channel = coreTypes.Hash256.from(claim.channel).toBytes();
  const amount = coreTypes.UInt64.from(BigInt(claim.amount)).toBytes();

  const bytesList = new BytesList();

  bytesList.put(prefix);
  bytesList.put(channel);
  bytesList.put(amount);
  return bytesList.toBytes();
}

function multiSigningData(tx: any, signingAccount: string | AccountID): Buffer {
  const prefix = HashPrefix.transactionMultiSig;
  const suffix = coreTypes.AccountID.from(signingAccount).toBytes();
  return serializeObject(tx, { prefix, suffix, signingFieldsOnly: true });
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
};
