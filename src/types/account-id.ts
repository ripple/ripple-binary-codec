import { Buffer } from 'buffer/'
import {
  decodeAccountID,
  encodeAccountID,
  isValidXAddress,
  xAddressToClassicAddress,
} from 'ripple-address-codec'

import Hash160 from './hash-160'

const HEX_REGEX = /^[A-F0-9]{40}$/u

/**
 * Class defining how to encode and decode an AccountID.
 */
export default class AccountID extends Hash160 {
  /* eslint-disable @typescript-eslint/no-magic-numbers ---
   * TODO describe this better */
  public static readonly DEFAULT_ACCOUNT_ID: AccountID = new AccountID(
    Buffer.alloc(20),
  )
  /* eslint-enable @typescript-eslint/no-magic-numbers */

  public constructor(bytes?: Buffer) {
    super(bytes ?? AccountID.DEFAULT_ACCOUNT_ID.bytes)
  }

  /**
   * Defines how to construct an AccountID.
   *
   * @param value - Either an existing AccountID, a hex-string, or a base58 r-Address.
   * @returns An AccountID object.
   * @throws Error.
   */
  public static from<T extends Hash160 | string>(value: T): AccountID {
    if (value instanceof AccountID) {
      return value
    }

    if (typeof value === 'string') {
      if (value === '') {
        return new AccountID()
      }

      return HEX_REGEX.test(value)
        ? new AccountID(Buffer.from(value, 'hex'))
        : this.fromBase58(value)
    }

    throw new Error('Cannot construct AccountID from value given')
  }

  /**
   * Defines how to build an AccountID from a base58 r-Address.
   *
   * @param input - A base58 r-Address.
   * @returns An AccountID object.
   * @throws Error.
   */
  public static fromBase58(input: string): AccountID {
    let value = input
    if (isValidXAddress(value)) {
      const classic = xAddressToClassicAddress(value)

      if (classic.tag !== false) {
        throw new Error('Only allowed to have tag on Account or Destination')
      }

      value = classic.classicAddress
    }

    return new AccountID(Buffer.from(decodeAccountID(value)))
  }

  /**
   * Overload of toJSON.
   *
   * @returns The base58 string for this AccountID.
   */
  public toJSON(): string {
    return this.toBase58()
  }

  /**
   * Defines how to encode AccountID into a base58 address.
   *
   * @returns The base58 string defined by this.bytes.
   */
  public toBase58(): string {
    /* eslint-disable @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any --
     * TODO we need this until ripple-address-codec types this function with the same `Buffer`
     * we're using */
    return encodeAccountID(this.bytes as any)
    /* eslint-enable @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any */
  }
}
