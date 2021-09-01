import { Buffer } from 'buffer/'

import Hash from './hash'

/**
 * Hash with a width of 160 bits.
 */
export default class Hash160 extends Hash {
  public static readonly WIDTH = 20
  public static readonly ZERO_160: Hash160 = new Hash160(
    Buffer.alloc(Hash160.WIDTH),
  )

  public constructor(inputBytes?: Buffer) {
    let bytes = inputBytes
    if (bytes && bytes.byteLength === 0) {
      bytes = Hash160.ZERO_160.bytes
    }

    super(bytes ?? Hash160.ZERO_160.bytes)
  }
}
