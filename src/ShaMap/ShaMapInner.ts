/* eslint-disable no-bitwise -- this file needs to use bitwise operations */
import * as assert from 'assert'

import { Buffer } from 'buffer/'

import HashPrefix from '../hash-prefixes'
import Sha512Half from '../hashes'
import BytesList from '../serdes/BytesList'
import { Hash256 } from '../types'

import ShaMapLeaf from './ShaMapLeaf'
import ShaMapNode from './ShaMapNode'

/**
 * Class defining an Inner Node of a SHAMap.
 */
export default class ShaMapInner extends ShaMapNode {
  private _slotBits = 0
  /* eslint-disable @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-magic-numbers --
   * TODO why, describe me */
  private _branches: ShaMapNode[] = Array(16) as ShaMapNode[]
  /* eslint-enable @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-magic-numbers */
  private readonly _depth: number

  public constructor(depth = 0) {
    super()
    this._depth = depth
  }

  /**
   * Returns `true` because ShaMapInners are always inner nodes.
   *
   * @returns `true`.
   */
  /* eslint-disable class-methods-use-this --
   * this method could be static, but its probably useful as is */
  public isInner(): true {
    return true
  }
  /* eslint-enable class-methods-use-this */

  /**
   * Returns `false` because ShaMapInners are never leaves.
   *
   * @returns `false`.
   */
  /* eslint-disable class-methods-use-this --
   * this method could be static, but its probably useful as is */
  public isLeaf(): false {
    return false
  }
  /* eslint-enable class-methods-use-this */

  /**
   * Get the hash prefix for this node.
   *
   * @returns Hash prefix describing an inner node.
   */
  /* eslint-disable class-methods-use-this --
   * this must be a method to fulfill the interface of ShaMapNode */
  public hashPrefix(): Buffer {
    return HashPrefix.innerNode
  }
  /* eslint-enable class-methods-use-this */

  /**
   * Set a branch of this node to be another node.
   *
   * @param slot - Slot to add branch to this._branches.
   * @param branch - Branch to add.
   */
  public setBranch(slot: number, branch: ShaMapNode): void {
    this._slotBits |= 1 << slot
    this._branches[slot] = branch
  }

  /**
   * Returns `true` if node is empty.
   *
   * @returns `true` if node is empty.
   */
  public empty(): boolean {
    return this._slotBits === 0
  }

  /**
   * Compute the hash of this node.
   *
   * @returns The hash of this node.
   */
  public hash(): Hash256 {
    if (this.empty()) {
      return Hash256.ZERO_256
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
  public toBytesSink(list: BytesList): void {
    for (const branch of this._branches) {
      const hash = branch ? branch.hash() : Hash256.ZERO_256
      hash.toBytesSink(list)
    }
  }

  /**
   * Add item to the SHAMap.
   *
   * @param index - Hash of the index of the item being inserted.
   * @param item - Item to insert in the map.
   * @param leaf - Leaf node to insert when branch doesn't exist.
   * @throws Error.
   */
  public addItem(index?: Hash256, item?: ShaMapNode, leaf?: ShaMapLeaf): void {
    assert(index !== undefined)
    const nibble = index.nibblet(this._depth)
    const existing = this._branches[nibble]

    if (existing === undefined) {
      this.setBranch(nibble, leaf ?? new ShaMapLeaf(index, item))
    } else if (existing instanceof ShaMapLeaf) {
      const newInner = new ShaMapInner(this._depth + 1)
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
