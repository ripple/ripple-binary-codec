import { Hash160 } from "./hash-160";
const ISO_REGEX = /^[A-Z0-9]{3}$/;
const HEX_REGEX = /^[A-F0-9]{40}$/;

/**
 * Convert an iso code to a currency bytes representation
 */
function isoToBytes(iso: string): Buffer {
  const bytes = Buffer.alloc(20);
  if (iso !== "XRP") {
    const isoBytes = iso.split("").map((c) => c.charCodeAt(0));
    bytes.set(isoBytes, 12);
  }
  return bytes;
}

/**
 * Tests if iso is a valid iso code
 */
function isISOCode(iso: string): boolean {
  return ISO_REGEX.test(iso);
}

/**
 * Tests if hex is a valid hex-string
 */
function isHex(hex: string): boolean {
  return HEX_REGEX.test(hex);
}

/**
 * Tests if a string is a valid representation of a currency
 */
function isStringRepresentation(str: string): boolean {
  return isISOCode(str) || isHex(str);
}

/**
 * Tests if a Buffer is a valid representation of a currency
 */
function isBytesArray(bytes: Buffer): boolean {
  return bytes.byteLength === 20;
}

/**
 * Ensures that a value is a valid representation of a currency
 */
function isValidRepresentation(val: Buffer | string): boolean {
  return val instanceof Buffer
    ? isBytesArray(val)
    : isStringRepresentation(val);
}

/**
 * Generate bytes from a string or buffer representation of a currency
 */
function bytesFromRepresentation(val: string): Buffer {
  if (!isValidRepresentation(val)) {
    throw new Error(`Unsupported Currency representation: ${val}`);
  }
  return val.length === 3 ? isoToBytes(val) : Buffer.from(val, "hex");
}

/**
 * Class defining how to encode and decode Currencies
 */
class Currency extends Hash160 {
  static XRP = new Currency(Buffer.alloc(20));
  _iso?: string;
  _isNative: boolean;

  constructor(byteBuf: Buffer) {
    super(byteBuf);
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
    this._isNative = onlyISO && code.toString("hex") === "000000";
    this._iso = this._isNative ? "XRP" : lossLessISO ? iso : undefined;
  }

  /**
   * Tells if this currency is native
   *
   * @returns true if native, false if not
   */
  isNative(): boolean {
    return this._isNative;
  }

  /**
   * Return the ISO code of this currency
   *
   * @returns ISO code if it exists, else undefined
   */
  iso(): string | undefined {
    return this._iso;
  }

  /**
   * Constructs a Currency object
   *
   * @param val Currency object or a string representation of a currency
   */
  static from(val: Currency | string): Currency {
    return val instanceof this
      ? val
      : new Currency(bytesFromRepresentation(val));
  }

  /**
   * Gets the JSON representation of a currency
   */
  toJSON(): string {
    const iso = this.iso();
    if (iso !== undefined) {
      return iso;
    }
    return this.bytes.toString("hex").toUpperCase();
  }
}

export { Currency };
