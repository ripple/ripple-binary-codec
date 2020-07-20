import { HashPrefix } from "./hash-prefixes";
import * as createHash from "create-hash";
import { BytesList } from "./serdes/binary-serializer";
import { Hash256 } from "./types/hash-256";

class Sha512Half extends BytesList {
  private hash: createHash;

  constructor() {
    super();

    this.hash = createHash("sha512");
  }

  static put(bytes: Buffer): Sha512Half {
    if (!(bytes instanceof Buffer)) {
      console.log(bytes);
      console.trace();
    }
    return new Sha512Half().put(bytes);
  }

  put(bytes: Buffer): Sha512Half {
    this.hash.update(bytes);
    return this;
  }

  finish256(): Buffer {
    const bytes = this.hash.digest();
    return bytes.slice(0, 32);
  }

  finish(): Hash256 {
    return new Hash256(this.finish256());
  }
}

function sha512Half(...args: Buffer[]): Buffer {
  const hash = new Sha512Half();
  args.forEach((a) => hash.put(a));
  return hash.finish256();
}

function transactionID(serialized: Buffer): Hash256 {
  return new Hash256(sha512Half(HashPrefix.transactionID, serialized));
}

export { Sha512Half, sha512Half, transactionID };
