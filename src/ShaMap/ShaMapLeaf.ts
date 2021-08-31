import { Buffer } from 'buffer/'

import { Sha512Half } from '../hashes'
import BytesList from '../serdes/BytesList'
import Hash256 from '../types/hash-256'

import ShaMapNode from './ShaMapNode'

/**
 * Class describing a Leaf of SHAMap.
 */
export default class ShaMapLeaf extends ShaMapNode {
  constructor(public index: Hash256, public item?: ShaMapNode) {
    super()
  }

  /**
   * @returns True as ShaMapLeaf is a leaf node.
   */
  isLeaf(): boolean {
    return true
  }

  /**
   * @returns False as ShaMapLeaf is not an inner node.
   */
  isInner(): boolean {
    return false
  }

  /**
   * Get the prefix of the this.item.
   *
   * @returns The hash prefix, unless this.item is undefined, then it returns an empty Buffer.
   */
  hashPrefix(): Buffer {
    return this.item === undefined ? Buffer.alloc(0) : this.item.hashPrefix()
  }

  /**
   * Hash the bytes representation of this.
   *
   * @returns Hash of this.item concatenated with this.index.
   */
  hash(): Hash256 {
    const hash = Sha512Half.put(this.hashPrefix())
    this.toBytesSink(hash)
    return hash.finish()
  }

  /**
   * Write the bytes representation of this to a BytesList.
   *
   * @param list - BytesList to write bytes to.
   */
  toBytesSink(list: BytesList): void {
    if (this.item !== undefined) {
      this.item.toBytesSink(list)
    }
    this.index.toBytesSink(list)
  }
}
