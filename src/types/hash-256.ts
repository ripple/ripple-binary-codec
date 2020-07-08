import { Hash } from "./hash";

class Hash256 extends Hash{
  static width: number = 32
  static ZERO_256 = new Hash256(Buffer.alloc(Hash256.width));
}

export { Hash256 };
