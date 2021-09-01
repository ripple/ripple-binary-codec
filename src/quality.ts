/* eslint-disable import/prefer-default-export, @typescript-eslint/no-extraneous-class --
 * TODO this file needs refactor, but it would create a breaking change as it would change how you import this */
import * as bigInt from 'big-integer'
import { Buffer } from 'buffer/'
import { Decimal } from 'decimal.js'

import { UInt64 } from './types'

/**
 * Class for encoding and decoding quality.
 */
/* eslint-disable @typescript-eslint/naming-convention --
 * TODO see above */
class quality {
  /* eslint-enable @typescript-eslint/naming-convention */

  /**
   * Encode quality amount.
   *
   * @param input - Input quality value to encode.
   * @returns Serialized quality.
   */
  public static encode(input: string): Buffer {
    /* eslint-disable @typescript-eslint/no-magic-numbers --
     * TODO refactor */
    const decimal = new Decimal(input)
    const exponent = decimal.e - 15
    const qualityString = decimal.times(`1e${-exponent}`).abs().toString()
    const bytes = UInt64.from(bigInt(qualityString)).toBytes()
    bytes[0] = exponent + 100
    return bytes
    /* eslint-enable @typescript-eslint/no-magic-numbers */
  }

  /**
   * Decode quality amount.
   *
   * @param input - Input quality value to encode.
   * @returns Deserialized quality.
   */
  public static decode(input: string): Decimal {
    /* eslint-disable @typescript-eslint/no-magic-numbers --
     * TODO refactor */
    const bytes = Buffer.from(input, 'hex').slice(-8)
    const exponent = bytes[0] - 100
    const mantissa = new Decimal(`0x${bytes.slice(1).toString('hex')}`)
    return mantissa.times(`1e${exponent}`)
    /* eslint-enable @typescript-eslint/no-magic-numbers */
  }
}

export { quality }
