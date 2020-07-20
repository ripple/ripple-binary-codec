import { coreTypes } from "./types";
import { Decimal } from "decimal.js";

class quality {
  static encode(arg: string): Buffer {
    const quality = new Decimal(arg);
    const exponent = quality.e - 15;
    const qualityString = quality.times(`1e${-exponent}`).abs().toString();
    const bytes = coreTypes.UInt64.from(BigInt(qualityString)).toBytes();
    bytes[0] = exponent + 100;
    return bytes;
  }

  static decode(arg: string): Decimal {
    const bytes = Buffer.from(arg, "hex").slice(-8);
    const exponent = bytes[0] - 100;
    const mantissa = new Decimal(`0x${bytes.slice(1).toString("hex")}`);
    return mantissa.times(`1e${exponent}`);
  }
}

export { quality };
