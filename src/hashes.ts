import { Buffer } from 'buffer/'
import * as createHash from 'create-hash'

import HashPrefix from './hash-prefixes'
import BytesList from './serdes/BytesList'
import Hash256 from './types/hash-256'

/**
 * Class for hashing with SHA512.
 *
 * @extends BytesList So SerializedTypes can write bytes to a Sha512Half
 */
class Sha512Half extends BytesList {
  private hash = createHash('sha512')

  /**
   * Construct a new Sha512Hash and write bytes this.hash.
   *
   * @param bytes - Bytes to write to this.hash.
   * @returns The new Sha512Hash object.
   */
  static put(bytes: Buffer): Sha512Half {
    return new Sha512Half().put(bytes)
  }

  /**
   * Write bytes to an existing Sha512Hash.
   *
   * @param bytes - Bytes to write to object.
   * @returns The Sha512 object.
   */
  put(bytes: Buffer): Sha512Half {
    this.hash.update(bytes)
    return this
  }

  /**
   * Compute SHA512 hash and slice in half.
   *
   * @returns Half of a SHA512 hash.
   */
  finish256(): Buffer {
    const bytes = Buffer.from(this.hash.digest())
    return bytes.slice(0, 32)
  }

  /**
   * Constructs a Hash256 from the Sha512Half object.
   *
   * @returns A Hash256 object.
   */
  finish(): Hash256 {
    return new Hash256(this.finish256())
  }
}

/**
 * Compute SHA512 hash of a list of bytes.
 *
 * @param args - Zero or more arguments to hash.
 * @returns The sha512half hash of the arguments.
 */
function sha512Half(...args: Buffer[]): Buffer {
  const hash = new Sha512Half()
  args.forEach((arg) => hash.put(arg))
  return hash.finish256()
}

/**
 * Construct a transactionID from a Serialized Transaction.
 *
 * @param serialized - Bytes to hash.
 * @returns A Hash256 object.
 */
function transactionID(serialized: Buffer): Hash256 {
  return new Hash256(sha512Half(HashPrefix.transactionID, serialized))
}

export { Sha512Half, sha512Half, transactionID }
