import { Buffer } from 'buffer/'

/**
 * Bytes list is a collection of buffer objects.
 */
export default class BytesList {
  private bytesArray: Buffer[] = []

  /**
   * Get the total number of bytes in the BytesList.
   *
   * @returns The number of bytes.
   */
  public getLength(): number {
    return Buffer.concat(this.bytesArray).byteLength
  }

  /**
   * Put bytes in the BytesList.
   *
   * @param bytesArg - A Buffer.
   * @returns This BytesList.
   */
  public put(bytesArg: Buffer | Uint8Array): BytesList {
    const bytes = Buffer.from(bytesArg) // Temporary, to catch instances of Uint8Array being passed in
    this.bytesArray.push(bytes)
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
    return Buffer.concat(this.bytesArray)
  }

  toHex(): string {
    return this.toBytes().toString('hex').toUpperCase()
  }
}
