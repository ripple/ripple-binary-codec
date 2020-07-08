import { decodeAccountID, encodeAccountID } from "ripple-address-codec";
import { Hash160 } from "./hash-160";

class AccountID extends Hash160 {
  static cache: object = {}
  base58: string = ""

  constructor(bytes: Buffer) {
    super(bytes);
  }

  static from(value: AccountID | string) {
      return value instanceof this
        ? value
        : /^r/.test(value)
        ? this.fromBase58(value)
        : new this(Buffer.from(value, 'hex'));
    }

  static fromCache(base58: string): AccountID {
    let cached = this.cache[base58];
    if (!cached) {
      cached = this.cache[base58] = this.fromBase58(base58);
    }
    return cached;
  }

  static fromBase58(value: string): AccountID {
    const acc = new AccountID(decodeAccountID(value));
    acc.base58 = value;
    return acc;
  }

  toJSON(): string {
    return this.toBase58();
  }

  toBase58(): string {
    return encodeAccountID(this.bytes);
  }
}

export { AccountID };
