import { Buffer } from 'buffer/'

import Hash from './hash'

/**
 * Hash with a width of 256 bits.
 */
export default class Hash256 extends Hash {
  public static readonly WIDTH = 32
  public static readonly ZERO_256 = new Hash256(Buffer.alloc(Hash256.WIDTH))

  public constructor(bytes: Buffer) {
    super(bytes ?? Hash256.ZERO_256.bytes)
  }
}
