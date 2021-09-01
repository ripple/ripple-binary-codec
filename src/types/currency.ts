/* eslint-disable @typescript-eslint/no-magic-numbers ---
 * TODO describe these magic numbers better */
import { Buffer } from 'buffer/'

import Hash160 from './hash-160'

const ISO_REGEX = /^[A-Z0-9]{3}$/u
const HEX_REGEX = /^[A-F0-9]{40}$/u

function isoToBytes(iso: string): Buffer {
  const bytes = Buffer.alloc(20)
  if (iso !== 'XRP') {
    const isoBytes = iso.split('').map((char) => char.charCodeAt(0))
    bytes.set(isoBytes, 12)
  }
  return bytes
}

function isIsoCode(iso: string): boolean {
  return ISO_REGEX.test(iso)
}

function isoCodeFromHex(code: Buffer): string | null {
  const iso = code.toString()
  if (iso === 'XRP') {
    throw new Error(
      'Disallowed currency code: to indicate the currency XRP you must use 20 bytes of 0s',
    )
  }
  if (isIsoCode(iso)) {
    return iso
  }
  return null
}

function isHex(hex: string): boolean {
  return HEX_REGEX.test(hex)
}

function isStringRepresentation(input: string): boolean {
  return input.length === 3 || isHex(input)
}

function isBytesArray(bytes: Buffer): boolean {
  return bytes.byteLength === 20
}

function isValidRepresentation(input: Buffer | string): boolean {
  return input instanceof Buffer
    ? isBytesArray(input)
    : isStringRepresentation(input)
}

function bytesFromRepresentation(input: string): Buffer {
  if (!isValidRepresentation(input)) {
    throw new Error(`Unsupported Currency representation: ${input}`)
  }
  return input.length === 3 ? isoToBytes(input) : Buffer.from(input, 'hex')
}

/**
 * Class defining how to encode and decode Currencies.
 */
export default class Currency extends Hash160 {
  public static readonly XRP = new Currency(Buffer.alloc(20))
  private readonly _iso: string | null

  public constructor(byteBuf: Buffer) {
    super(byteBuf ?? Currency.XRP.bytes)
    const code = this.bytes.slice(12, 15)

    if (this.bytes[0] !== 0) {
      this._iso = null
    } else if (code.toString('hex') === '000000') {
      this._iso = 'XRP'
    } else {
      this._iso = isoCodeFromHex(code)
    }
  }

  /**
   * Constructs a Currency object.
   *
   * @param value - Value to translate into a Currency object.
   * @returns Currency object from input.
   * @throws Error.
   */
  public static from<T extends Hash160 | string>(value: T): Currency {
    if (value instanceof Currency) {
      return value
    }

    if (typeof value === 'string') {
      return new Currency(bytesFromRepresentation(value))
    }

    throw new Error('Cannot construct Currency from value given')
  }

  /**
   * Return the ISO code of this currency.
   *
   * @returns ISO code if it exists, else null.
   */
  public iso(): string | null {
    return this._iso
  }

  /**
   * Gets the JSON representation of a currency.
   *
   * @returns JSON representation.
   */
  public toJSON(): string {
    const iso = this.iso()
    if (iso !== null) {
      return iso
    }
    return this.bytes.toString('hex').toUpperCase()
  }
}
