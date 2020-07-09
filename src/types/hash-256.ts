import { Hash } from "./hash";

/**
 * Hash with a width of 256 bits
 */
class Hash256 extends Hash {
  static readonly width = 32;
  static readonly ZERO_256 = new Hash256(Buffer.alloc(Hash256.width));
}

export { Hash256 };
