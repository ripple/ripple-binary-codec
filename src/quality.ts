import * as bigInt from 'big-integer'
import { Buffer } from 'buffer/'
import { Decimal } from 'decimal.js'

import coreTypes from './types'

/**
 * Class for encoding and decoding quality.
 */
class quality {
  /**
   * Encode quality amount.
   *
   * @param input - Input quality value to encode.
   * @returns Serialized quality.
   */
  static encode(input: string): Buffer {
    const decimal = new Decimal(input)
    const exponent = decimal.e - 15
    const qualityString = decimal.times(`1e${-exponent}`).abs().toString()
    const bytes = coreTypes.UInt64.from(bigInt(qualityString)).toBytes()
    bytes[0] = exponent + 100
    return bytes
  }

  /**
   * Decode quality amount.
   *
   * @param input - Input quality value to encode.
   * @returns Deserialized quality.
   */
  static decode(input: string): Decimal {
    const bytes = Buffer.from(input, 'hex').slice(-8)
    const exponent = bytes[0] - 100
    const mantissa = new Decimal(`0x${bytes.slice(1).toString('hex')}`)
    return mantissa.times(`1e${exponent}`)
  }
}

export { quality }
