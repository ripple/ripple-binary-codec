import { strict as assert } from "assert";
import { BN } from "bn.js";
import { makeClass } from "../utils/make-class";
import { bytesToHex, parseBytes, serializeUIntN } from "../utils/bytes-utils";
import { UInt } from "./uint";

const HEX_REGEX = /^[A-F0-9]{16}$/;

const UInt64 = makeClass(
  {
    inherits: UInt,
    statics: { width: 8 },
    UInt64(arg: any = 0) {
      const argType = typeof arg;
      if (argType === "number") {
        assert(arg >= 0);
        this._bytes = new Uint8Array(8);
        this._bytes.set(serializeUIntN(arg, 4), 4);
      } else if (arg instanceof BN) {
        this._bytes = parseBytes(arg.toArray("be", 8), Uint8Array);
        this._toBN = arg;
      } else {
        if (argType === "string") {
          if (!HEX_REGEX.test(arg)) {
            throw new Error(`${arg} is not a valid UInt64 hex string`);
          }
        }
        this._bytes = parseBytes(arg, Uint8Array);
      }
      assert(this._bytes.length === 8);
    },
    toJSON() {
      return bytesToHex(this._bytes);
    },
    valueOf() {
      return this.toBN();
    },
    cached: {
      toBN() {
        return new BN(this._bytes);
      },
    },
    toBytes() {
      return this._bytes;
    },
  },
  undefined
);

export { UInt64 };
