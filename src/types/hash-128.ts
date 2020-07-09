import { Hash } from "./hash";

/**
 * Hash with a width of 128 bits
 */
class Hash128 extends Hash {
  static readonly width = 16;
}

export { Hash128 };
