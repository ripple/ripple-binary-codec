import { Buffer } from 'buffer/'

import BytesList from '../serdes/BytesList'
import Hash256 from '../types/hash-256'

/**
 * Abstract class describing a SHAMapNode.
 */
export default abstract class ShaMapNode {
  abstract hashPrefix(): Buffer
  abstract isLeaf(): boolean
  abstract isInner(): boolean
  abstract toBytesSink(list: BytesList): void
  abstract hash(): Hash256
}
