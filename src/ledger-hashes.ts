import * as _ from "lodash";
import * as assert from "assert"
import { ShaMap, ShaMapNode } from "./shamap";
import { HashPrefix } from "./hash-prefixes";
import { Sha512Half } from "./hashes";
import { BinarySerializer, serializeObject } from "./binary";
import { Hash256 } from "./types/hash-256";
import { STObject } from "./types/st-object";
import { UInt64 } from './types/uint-64';
import { UInt32 } from "./types/uint-32";
import { UInt8 } from "./types/uint-8";

function computeHash(itemizer, itemsJson: Array<Record<string, any>>): Hash256 {
  const map = new ShaMap();
  itemsJson.forEach((item) => map.addItem(...itemizer(item)));
  return map.hash();
}

interface transactionItemObject {
  hash: string;
  metaData: any;
}

function transactionItem(json: transactionItemObject): [Hash256, ShaMapNode] {
  assert(json.hash);
  const index = Hash256.from(json.hash);
  const item = {
    hashPrefix() {
      return HashPrefix.transaction;
    },
    toBytesSink(sink) {
      const serializer = new BinarySerializer(sink);
      serializer.writeLengthEncoded(STObject.from(json));
      serializer.writeLengthEncoded(STObject.from(json.metaData));
    },
  } as ShaMapNode;
  return [index, item];
}

interface entryItemObject {
  index: string;
}
function entryItem(json: entryItemObject): [Hash256, ShaMapNode] {
  const index = Hash256.from(json.index);
  const bytes = serializeObject(json);
  const item = {
    hashPrefix() {
      return HashPrefix.accountStateEntry;
    },
    toBytesSink(sink) {
      sink.put(bytes);
    },
  } as ShaMapNode;
  return [index, item];
}

const transactionTreeHash = _.partial(computeHash, transactionItem);
const accountStateHash = _.partial(computeHash, entryItem);

interface ledgerHashObject {
  ledger_index: number;
  total_coins: string | number | bigint;
  parent_hash: string;
  transaction_hash: string;
  account_hash: string;
  parent_close_time: number;
  close_time: number;
  close_time_resolution: number;
  close_flags: number;
}

function ledgerHash(header: ledgerHashObject): Hash256 {
  const hash = new Sha512Half();
  hash.put(HashPrefix.ledgerHeader);
  assert(header.parent_close_time !== undefined);
  assert(header.close_flags !== undefined);

  UInt32.from(header.ledger_index).toBytesSink(hash);
  UInt64.from(BigInt(header.total_coins)).toBytesSink(hash);
  Hash256.from(header.parent_hash).toBytesSink(hash);
  Hash256.from(header.transaction_hash).toBytesSink(hash);
  Hash256.from(header.account_hash).toBytesSink(hash);
  UInt32.from(header.parent_close_time).toBytesSink(hash);
  UInt32.from(header.close_time).toBytesSink(hash);
  UInt8.from(header.close_time_resolution).toBytesSink(hash);
  UInt8.from(header.close_flags).toBytesSink(hash);
  return hash.finish();
}

export { accountStateHash, transactionTreeHash, ledgerHash };
