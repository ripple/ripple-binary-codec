import { Hash } from "./hash";

/**
 * Hash with a width of 160 bits
 */
class Hash160 extends Hash {
  static readonly width = 20;
}

export { Hash160 };
