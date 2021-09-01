/* eslint-disable no-bitwise -- this file needs to use bitwise operations */
import { Buffer } from 'buffer/'

import BinaryParser from '../../serdes/BinaryParser'
import AccountID from '../account-id'
import Currency from '../currency'
import SerializedType, { JsonObject } from '../SerializedType'

/**
 * Constant for masking types of a Hop.
 */
const TYPE_ACCOUNT = 0x01
const TYPE_CURRENCY = 0x10
const TYPE_ISSUER = 0x20

/**
 * The object representation of a Hop, an issuer AccountID, an account AccountID, and a Currency.
 */
export interface HopObject extends JsonObject {
  issuer?: string
  account?: string
  currency?: string
}

/**
 * Serialize and Deserialize a Hop.
 */
export default class Hop extends SerializedType {
  /**
   * Create a Hop from a HopObject.
   *
   * @param value - Either a hop or HopObject to create a hop with.
   * @returns A Hop.
   */
  public static from(value: Hop | HopObject): Hop {
    if (value instanceof Hop) {
      return value
    }

    const bytes: Buffer[] = [Buffer.from([0])]

    if (value.account) {
      bytes.push(AccountID.from(value.account).toBytes())
      bytes[0][0] |= TYPE_ACCOUNT
    }

    if (value.currency) {
      bytes.push(Currency.from(value.currency).toBytes())
      bytes[0][0] |= TYPE_CURRENCY
    }

    if (value.issuer) {
      bytes.push(AccountID.from(value.issuer).toBytes())
      bytes[0][0] |= TYPE_ISSUER
    }

    return new Hop(Buffer.concat(bytes))
  }

  /**
   * Construct a Hop from a BinaryParser.
   *
   * @param parser - BinaryParser to read the Hop from.
   * @returns A Hop.
   */
  public static fromParser(parser: BinaryParser): Hop {
    const type = parser.readUInt8()
    const bytes: Buffer[] = [Buffer.from([type])]

    if (type & TYPE_ACCOUNT) {
      bytes.push(parser.read(AccountID.WIDTH))
    }

    if (type & TYPE_CURRENCY) {
      bytes.push(parser.read(Currency.WIDTH))
    }

    if (type & TYPE_ISSUER) {
      bytes.push(parser.read(AccountID.WIDTH))
    }

    return new Hop(Buffer.concat(bytes))
  }

  /**
   * Get the JSON interpretation of this hop.
   *
   * @returns A HopObject, an JS object with optional account, issuer, and currency.
   */
  public toJSON(): HopObject {
    const hopParser = new BinaryParser(this.bytes.toString('hex'))
    const type = hopParser.readUInt8()
    const result: HopObject = {}

    /* eslint-disable @typescript-eslint/consistent-type-assertions --
     * TODO it may be possible to get rid of this with a generic type on the
     * SerializedType.fromParser func */
    if (type & TYPE_ACCOUNT) {
      result.account = AccountID.fromParser(hopParser).toJSON() as string
    }

    if (type & TYPE_CURRENCY) {
      result.currency = Currency.fromParser(hopParser).toJSON() as string
    }

    if (type & TYPE_ISSUER) {
      result.issuer = AccountID.fromParser(hopParser).toJSON() as string
    }
    /* eslint-enable @typescript-eslint/consistent-type-assertions */

    return result
  }

  /**
   * Get a number representing the type of this hop.
   *
   * @returns A number to be bitwise and-ed with TYPE_ constants to describe the types in the hop.
   */
  public type(): number {
    return this.bytes[0]
  }
}
