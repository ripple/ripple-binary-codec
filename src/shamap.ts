/* eslint-disable no-bitwise -- this file needs to use bitwise operations */
import { strict as assert } from 'assert'

import { Buffer } from 'buffer/'

import HashPrefix from './hash-prefixes'
import { Sha512Half } from './hashes'
import { BytesList } from './serdes/binary-serializer'
import coreTypes from './types'
import Hash256 from './types/hash-256'

/**
 * Abstract class describing a SHAMapNode.
 */
abstract class ShaMapNode {
  abstract hashPrefix(): Buffer
  abstract isLeaf(): boolean
  abstract isInner(): boolean
  abstract toBytesSink(list: BytesList): void
  abstract hash(): Hash256
}

/**
 * Class describing a Leaf of SHAMap.
 */
class ShaMapLeaf extends ShaMapNode {
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

/**
 * Class defining an Inner Node of a SHAMap.
 */
class ShaMapInner extends ShaMapNode {
  private slotBits = 0
  private branches: ShaMapNode[] = Array(16)

  constructor(private depth: number = 0) {
    super()
  }

  /**
   * @returns True as ShaMapInner is an inner node.
   */
  isInner(): boolean {
    return true
  }

  /**
   * @returns False as ShaMapInner is not a leaf node.
   */
  isLeaf(): boolean {
    return false
  }

  /**
   * Get the hash prefix for this node.
   *
   * @returns Hash prefix describing an inner node.
   */
  hashPrefix(): Buffer {
    return HashPrefix.innerNode
  }

  /**
   * Set a branch of this node to be another node.
   *
   * @param slot - Slot to add branch to this.branches.
   * @param branch - Branch to add.
   */
  setBranch(slot: number, branch: ShaMapNode): void {
    this.slotBits |= 1 << slot
    this.branches[slot] = branch
  }

  /**
   * @returns True if node is empty.
   */
  empty(): boolean {
    return this.slotBits === 0
  }

  /**
   * Compute the hash of this node.
   *
   * @returns The hash of this node.
   */
  hash(): Hash256 {
    if (this.empty()) {
      return coreTypes.Hash256.ZERO_256
    }
    const hash = Sha512Half.put(this.hashPrefix())
    this.toBytesSink(hash)
    return hash.finish()
  }

  /**
   * Writes the bytes representation of this node to a BytesList.
   *
   * @param list - BytesList to write bytes to.
   */
  toBytesSink(list: BytesList): void {
    for (const branch of this.branches) {
      const hash = branch ? branch.hash() : coreTypes.Hash256.ZERO_256
      hash.toBytesSink(list)
    }
  }

  /**
   * Add item to the SHAMap.
   *
   * @param index - Hash of the index of the item being inserted.
   * @param item - Item to insert in the map.
   * @param leaf - Leaf node to insert when branch doesn't exist.
   * @throws {Error}
   */
  addItem(index?: Hash256, item?: ShaMapNode, leaf?: ShaMapLeaf): void {
    assert(index !== undefined)
    const nibble = index.nibblet(this.depth)
    const existing = this.branches[nibble]

    if (existing === undefined) {
      this.setBranch(nibble, leaf || new ShaMapLeaf(index, item))
    } else if (existing instanceof ShaMapLeaf) {
      const newInner = new ShaMapInner(this.depth + 1)
      newInner.addItem(existing.index, undefined, existing)
      newInner.addItem(index, item, leaf)
      this.setBranch(nibble, newInner)
    } else if (existing instanceof ShaMapInner) {
      existing.addItem(index, item, leaf)
    } else {
      throw new Error('invalid ShaMap.addItem call')
    }
  }
}

class ShaMap extends ShaMapInner {}

export { ShaMap, ShaMapNode, ShaMapLeaf }
