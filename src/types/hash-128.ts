import { Buffer } from 'buffer/'

import Hash from './hash'

/**
 * Hash with a width of 128 bits.
 */
export default class Hash128 extends Hash {
  public static readonly WIDTH = 16
  public static readonly ZERO_128: Hash128 = new Hash128(
    Buffer.alloc(Hash128.WIDTH),
  )

  public constructor(bytes: Buffer) {
    super(bytes ?? Hash128.ZERO_128.bytes)
  }
}
