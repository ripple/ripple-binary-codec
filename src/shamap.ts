import { strict as assert } from "assert";
import { coreTypes } from "./types";
import { HashPrefix } from "./hash-prefixes";
import { Sha512Half } from "./hashes";
import { Hash256 } from "./types/hash-256";
import { SerializedType } from "./types/serialized-type";
import { BytesList } from "./serdes/binary-serializer";

abstract class ShaMapNode extends SerializedType {
  abstract hashPrefix(): Buffer;
  abstract isLeaf(): boolean;
  abstract isInner(): boolean;
  abstract hash(): Hash256;

  constructor() {
    super(Buffer.alloc(0));
  }
}

class ShaMapLeaf extends ShaMapNode {
  constructor(public index, public item) {
    super();
  }

  isLeaf(): boolean {
    return true;
  }

  isInner(): boolean {
    return false;
  }

  hashPrefix(): Buffer {
    return this.item.hashPrefix();
  }

  hash(): Hash256 {
    const hash = Sha512Half.put(this.hashPrefix());
    this.toBytesSink(hash);
    return hash.finish();
  }

  toBytesSink(sink: BytesList): void {
    this.item.toBytesSink(sink);
    this.index.toBytesSink(sink);
  }
}

class ShaMapInner extends ShaMapNode {
  private slotBits = 0;
  private branches: Array<ShaMapNode> = Array(16);

  constructor(private depth: number = 0) {
    super();
  }

  isInner(): boolean {
    return true;
  }

  isLeaf(): boolean {
    return false;
  }

  hashPrefix(): Buffer {
    return HashPrefix.innerNode;
  }

  setBranch(slot: number, branch: ShaMapNode): void {
    this.slotBits = this.slotBits | (1 << slot);
    this.branches[slot] = branch;
  }

  empty(): boolean {
    return this.slotBits === 0;
  }

  hash(): Hash256 {
    if (this.empty()) {
      return coreTypes.Hash256.ZERO_256;
    }
    const hash = Sha512Half.put(this.hashPrefix());
    this.toBytesSink(hash);
    return hash.finish();
  }

  toBytesSink(sink: BytesList): void {
    for (let i = 0; i < this.branches.length; i++) {
      const branch = this.branches[i];
      const hash = branch ? branch.hash() : coreTypes.Hash256.ZERO_256;
      hash.toBytesSink(sink);
    }
  }

  addItem(index?: Hash256, item?: ShaMapNode, leaf?: ShaMapLeaf) {
    assert(index instanceof coreTypes.Hash256);
    const nibble = index.nibblet(this.depth);
    const existing = this.branches[nibble];

    if (existing === undefined) {
      this.setBranch(nibble, leaf || new ShaMapLeaf(index, item));
    } else if (existing instanceof ShaMapLeaf) {
      const newInner = new ShaMapInner(this.depth + 1);
      newInner.addItem(existing.index, undefined, existing);
      newInner.addItem(index, item, leaf);
      this.setBranch(nibble, newInner);
    } else if (existing instanceof ShaMapInner) {
      existing.addItem(index, item, leaf);
    } else {
      throw new Error("invalid ShaMap.addItem call");
    }
  }
}

class ShaMap extends ShaMapInner {}

export { ShaMap, ShaMapNode };
