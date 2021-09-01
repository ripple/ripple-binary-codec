import { Buffer } from 'buffer/'

import Sha512Half from '../hashes'
import BytesList from '../serdes/BytesList'
import Hash256 from '../types/hash-256'

import ShaMapNode from './ShaMapNode'

/**
 * Class describing a Leaf of SHAMap.
 */
export default class ShaMapLeaf extends ShaMapNode {
  public index: Hash256
  public item?: ShaMapNode

  public constructor(index: Hash256, item?: ShaMapNode) {
    super()
    this.index = index
    this.item = item
  }

  /**
   * Returns `true` because ShaMapLeafs are always leaf node.
   *
   * @returns True.
   */
  /* eslint-disable class-methods-use-this --
   * this method could be static, but its probably useful as is */
  public isLeaf(): true {
    return true
  }
  /* eslint-enable class-methods-use-this */

  /**
   * Returns `false` because ShaMapLeafs are never inner nodes.
   *
   * @returns False.
   */
  /* eslint-disable class-methods-use-this --
   * this method could be static, but its probably useful as is */
  public isInner(): false {
    return false
  }
  /* eslint-enable class-methods-use-this */

  /**
   * Get the prefix of the this.item.
   *
   * @returns The hash prefix, unless this.item is undefined, then it returns an empty Buffer.
   */
  public hashPrefix(): Buffer {
    return this.item === undefined ? Buffer.alloc(0) : this.item.hashPrefix()
  }

  /**
   * Hash the bytes representation of this.
   *
   * @returns Hash of this.item concatenated with this.index.
   */
  public hash(): Hash256 {
    const hash = Sha512Half.put(this.hashPrefix())
    this.toBytesSink(hash)
    return hash.finish()
  }

  /**
   * Write the bytes representation of this to a BytesList.
   *
   * @param list - BytesList to write bytes to.
   */
  public toBytesSink(list: BytesList): void {
    if (this.item !== undefined) {
      this.item.toBytesSink(list)
    }
    this.index.toBytesSink(list)
  }
}
