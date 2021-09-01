import { Buffer } from 'buffer/'

/**
 * Bytes list is a collection of buffer objects.
 */
export default class BytesList {
  private readonly _bytesArray: Buffer[] = []

  /**
   * Get the total number of bytes in the BytesList.
   *
   * @returns The number of bytes.
   */
  public getLength(): number {
    return Buffer.concat(this._bytesArray).byteLength
  }

  /**
   * Put bytes in the BytesList.
   *
   * @param bytesArg - A Buffer.
   * @returns This BytesList.
   */
  public put(bytesArg: Buffer | Uint8Array): BytesList {
    // Temporary, to catch instances of Uint8Array being passed in
    const bytes = Buffer.from(bytesArg)

    this._bytesArray.push(bytes)
    return this
  }

  /**
   * Write this BytesList to the back of another bytes list.
   *
   *  @param list - The BytesList to write to.
   */
  public toBytesSink(list: BytesList): void {
    list.put(this.toBytes())
  }

  public toBytes(): Buffer {
    return Buffer.concat(this._bytesArray)
  }

  public toHex(): string {
    return this.toBytes().toString('hex').toUpperCase()
  }
}
