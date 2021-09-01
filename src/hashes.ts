import { Buffer } from 'buffer/'
import * as createHash from 'create-hash'

import BytesList from './serdes/BytesList'
import Hash256 from './types/hash-256'

/**
 * Class for hashing with SHA512.
 */
export default class Sha512Half extends BytesList {
  private readonly _hash = createHash('sha512')

  /**
   * Construct a new Sha512Hash and write bytes this.hash.
   *
   * @param bytes - Bytes to write to this.hash.
   * @returns The new Sha512Hash object.
   */
  public static put(bytes: Buffer): Sha512Half {
    return new Sha512Half().put(bytes)
  }

  /**
   * Write bytes to an existing Sha512Hash.
   *
   * @param bytes - Bytes to write to object.
   * @returns The Sha512 object.
   */
  public put(bytes: Buffer): Sha512Half {
    this._hash.update(bytes)
    return this
  }

  /**
   * Compute SHA512 hash and slice in half.
   *
   * @returns Half of a SHA512 hash.
   */
  public finish256(): Buffer {
    const bytes = Buffer.from(this._hash.digest())
    /* eslint-disable @typescript-eslint/no-magic-numbers --
     * This is half of a 64 byte buffer */
    return bytes.slice(0, 32)
    /* eslint-enable @typescript-eslint/no-magic-numbers */
  }

  /**
   * Constructs a Hash256 from the Sha512Half object.
   *
   * @returns A Hash256 object.
   */
  public finish(): Hash256 {
    return new Hash256(this.finish256())
  }
}
