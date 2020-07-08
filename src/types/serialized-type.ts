import { BytesList } from "../serdes/binary-serializer";
const { bytesToHex, slice } = require("../utils/bytes-utils");


class SerializedTypeClass {
  protected bytes: Buffer = Buffer.alloc(0)

  toBytesSink(list: BytesList): void {
    list.put(this.bytes);
  }

  toHex(): string {
    return (this.toBytes()).toString('hex').toUpperCase();
  }

  toBytes(): Buffer {
    if (this.bytes) {
      return this.bytes;
    }
    const bl = new BytesList();
    this.toBytesSink(bl);
    return bl.toBytes();
  }

  toJSON(): any {
    return this.toHex();
  }

  toString(): string {
    return this.toHex();
  }
};

class ComparableClass extends SerializedTypeClass {
  lt(other: ComparableClass): boolean {
    return this.compareTo(other) < 0;
  }

  eq(other: ComparableClass): boolean {
    return this.compareTo(other) === 0;
  }

  gt(other: ComparableClass): boolean {
    return this.compareTo(other) > 0;
  }

  gte(other: ComparableClass): boolean {
    return this.compareTo(other) > -1;
  }

  lte(other: ComparableClass): boolean {
    return this.compareTo(other) < 1;
  }

  compareTo(other: ComparableClass): number {
    throw new Error("cannot compare " + this + " and " + other)
  }
};

const Comparable = {
  lt(other) {
    return this.compareTo(other) < 0;
  },
  eq(other) {
    return this.compareTo(other) === 0;
  },
  gt(other) {
    return this.compareTo(other) > 0;
  },
  gte(other) {
    return this.compareTo(other) > -1;
  },
  lte(other) {
    return this.compareTo(other) < 1;
  },
};

const SerializedType = {
  toBytesSink(sink) {
    sink.put(this._bytes);
  },
  toHex() {
    return bytesToHex(this.toBytes());
  },
  toBytes() {
    if (this._bytes) {
      return slice(this._bytes);
    }
    const bl = new BytesList();
    this.toBytesSink(bl);
    return bl.toBytes();
  },
  toJSON() {
    return this.toHex();
  },
  toString() {
    return this.toHex();
  },
};

function ensureArrayLikeIs(Type, arrayLike) {
  return {
    withChildren(Child) {
      if (arrayLike instanceof Type) {
        return arrayLike;
      }
      const obj = new Type();
      for (let i = 0; i < arrayLike.length; i++) {
        obj.push(Child.from(arrayLike[i]));
      }
      return obj;
    },
  };
}

export { ensureArrayLikeIs, SerializedType, SerializedTypeClass, Comparable, ComparableClass };
