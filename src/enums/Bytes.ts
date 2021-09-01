/* eslint-disable no-bitwise -- this file needs to use bitwise operations */
import { Buffer } from 'buffer/'

import type BytesList from '../serdes/BytesList'

// @brief: Bytes, name, and ordinal representing one type, ledger_type, transaction type, or result
export default class Bytes {
  public readonly ordinal: number
  public readonly name: string
  private readonly _bytes: Uint8Array

  public constructor(name: string, ordinal: number, ordinalWidth: number) {
    this.ordinal = ordinal
    this.name = name
    this._bytes = Buffer.alloc(ordinalWidth)
    for (let i = 0; i < ordinalWidth; i++) {
      /* eslint-disable @typescript-eslint/no-magic-numbers --
       * TODO describe better */
      this._bytes[ordinalWidth - i - 1] = (this.ordinal >>> (i * 8)) & 0xff
      /* eslint-enable @typescript-eslint/no-magic-numbers */
    }
  }

  public toJSON(): string {
    return this.name
  }

  public toBytesSink(sink: BytesList): void {
    sink.put(this._bytes)
  }

  public toBytes(): Uint8Array {
    return this._bytes
  }
}
