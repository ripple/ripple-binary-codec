/* eslint-disable no-bitwise -- this file needs to use bitwise operations */
import { Buffer } from 'buffer/'

import type BytesList from '../serdes/BytesList'

/*
 * @brief: Bytes, name, and ordinal representing one type, ledger_type, transaction type, or result
 */
export default class Bytes {
  readonly bytes: Uint8Array

  constructor(
    readonly name: string,
    readonly ordinal: number,
    readonly ordinalWidth: number,
  ) {
    this.bytes = Buffer.alloc(ordinalWidth)
    for (let i = 0; i < ordinalWidth; i++) {
      this.bytes[ordinalWidth - i - 1] = (ordinal >>> (i * 8)) & 0xff
    }
  }

  toJSON(): string {
    return this.name
  }

  toBytesSink(sink: BytesList): void {
    sink.put(this.bytes)
  }

  toBytes(): Uint8Array {
    return this.bytes
  }
}
