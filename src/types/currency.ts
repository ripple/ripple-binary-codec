const _ = require("lodash");
import { Hash160 } from "./hash-160";
const ISO_REGEX = /^[A-Z0-9]{3}$/;
const HEX_REGEX = /^[A-F0-9]{40}$/;

function isoToBytes(iso) {
  const bytes = Buffer.alloc(20);
  if (iso !== "XRP") {
    const isoBytes = iso.split("").map((c) => c.charCodeAt(0));
    bytes.set(isoBytes, 12);
  }
  return bytes;
}

function isISOCode(val) {
  return val.length === 3; // ISO_REGEX.test(val);
}

function isHex(val) {
  return HEX_REGEX.test(val);
}

function isStringRepr(val) {
  return _.isString(val) && (isISOCode(val) || isHex(val));
}

function isBytesArray(val) {
  return val.length === 20;
}

function isValidRepr(val) {
  return isStringRepr(val) || isBytesArray(val);
}

function bytesFromRepr(val) {
  if (isValidRepr(val)) {
    // We assume at this point that we have an object with a length, either 3,
    // 20 or 40.
    return val.length === 3 ? isoToBytes(val) : val;
  }
  throw new Error(`Unsupported Currency repr: ${val}`);
}

class Currency extends Hash160 {
  static XRP = new Currency(Buffer.alloc(20));
  static width: number = 20
  _iso?: string
  _isNative: boolean
  
  isNative(): boolean {
   return this._isNative
  }

  iso(): string | undefined {
    return this._iso
  }

  static from(val: Currency | string): Currency {
    return val instanceof this ? val : new Currency(Buffer.from(bytesFromRepr(val),'hex'));
  }

  constructor(byteBuf: Buffer) {
    super(byteBuf);
    // We only have a non null iso() property available if the currency can be
    // losslessly represented by the 3 letter iso code. If none is available a
    // hex encoding of the full 20 bytes is the canonical representation.
    let onlyISO = true;

    const bytes = this.bytes;
    const code = this.bytes.slice(12, 15);
    const iso = code.toString();

    for (let i = bytes.length - 1; i >= 0; i--) {
      if (bytes[i] !== 0 && !(i === 12 || i === 13 || i === 14)) {
        onlyISO = false;
        break;
      }
    }

    const lossLessISO = onlyISO && iso !== "XRP" && ISO_REGEX.test(iso);
    this._isNative = onlyISO && code.toString('hex') === "000000";
    this._iso = this._isNative ? "XRP" : lossLessISO ? iso : undefined;
  }

  toJSON(): string {
    const iso = this.iso()
    if (iso !== undefined) {
      return iso;
    }
    return this.bytes.toString('hex').toUpperCase();
  }
}

export { Currency };
