/* eslint-disable no-unused-expressions */

import { AccountID } from "./account-id";
import { Currency } from "./currency";
import { BinaryParser } from "../serdes/binary-parser";
import { SerializedTypeClass } from "./serialized-type";

const PATHSET_END_BYTE = 0x00;
const PATH_SEPARATOR_BYTE = 0xff;
const TYPE_ACCOUNT = 0x01;
const TYPE_CURRENCY = 0x10;
const TYPE_ISSUER = 0x20;

interface HopObject {
  issuer?: string
  account?: string
  currency?: string
}

class Hop extends SerializedTypeClass {
  constructor(bytes: Buffer) {
    super(bytes)
  }
  
  static from(value: Hop | HopObject): Hop {
    if (value instanceof this) {
      return value;
    }

    let bytes: Array<Buffer> = [ Buffer.from([0]) ]

    if(value.account) {
      bytes.push(AccountID.from(value.account).toBytes());
      bytes[0][0] |= TYPE_ACCOUNT;
    }

    if(value.currency) {
      bytes.push(Currency.from(value.currency).toBytes());
      bytes[0][0] |= TYPE_CURRENCY;
    }

    if(value.issuer) {
      bytes.push(AccountID.from(value.issuer).toBytes());
      bytes[0][0] |= TYPE_ISSUER;
    }

    return new Hop(Buffer.concat(bytes));
  }

  static fromParser(parser: BinaryParser): Hop {
    let type = parser.readUInt8();
    let bytes: Array<Buffer> = [Buffer.from([type])]

    type & TYPE_ACCOUNT && (bytes.push(parser.read(AccountID.width)));
    type & TYPE_CURRENCY && (bytes.push(parser.read(Currency.width)));
    type & TYPE_ISSUER && (bytes.push(parser.read(AccountID.width)));
    return new Hop(Buffer.concat(bytes));
  }

  toJSON(): HopObject {
    let hopParser = new BinaryParser(this.bytes.toString('hex'));
    let type = hopParser.readUInt8();

    const ret: HopObject = {}
    type & TYPE_ACCOUNT && (ret.account = AccountID.fromParser(hopParser).toJSON());
    type & TYPE_CURRENCY && (ret.currency = Currency.fromParser(hopParser).toJSON());
    type & TYPE_ISSUER && (ret.issuer = AccountID.fromParser(hopParser).toJSON());
    return ret;
  }

  type(): number {
    return this.bytes[0];
  }
}


class Path extends SerializedTypeClass {
  constructor(bytes: Buffer) {
    super(bytes)
  }

  static from(value: Path | Array<HopObject>): Path {
    if(value instanceof Path) {
      return value
    }

    let bytes: Array<Buffer> = []
    value.forEach((hop: HopObject) => {
      bytes.push(Hop.from(hop).toBytes())
    })

    return new Path(Buffer.concat(bytes));
  }

  static fromParser(parser: BinaryParser): Path {
    let bytes: Array<Buffer> = []
    while(!parser.end()) {
      bytes.push(Hop.fromParser(parser).toBytes());

      if(parser.peek() === PATHSET_END_BYTE ||
         parser.peek() === PATH_SEPARATOR_BYTE) {
        break;
      }
    }
    return new Path(Buffer.concat(bytes))
  }

  toJSON() {
    let json: Array<HopObject> = []
    let pathParser = new BinaryParser(this.bytes.toString('hex'));

    while(!pathParser.end()) {
      json.push(Hop.fromParser(pathParser).toJSON())
    }

    return json;
  }
}

class PathSet extends SerializedTypeClass {

  constructor(bytes: Buffer) {
    super(bytes);
  }

  static from(value: PathSet | Array<Array<HopObject>>): PathSet {
    if(value instanceof PathSet) {
      return value;
    }

    let bytes: Array<Buffer> = [];

    value.forEach((path: Array<HopObject>) => {
      bytes.push(Path.from(path).toBytes());
      bytes.push(Buffer.from([PATH_SEPARATOR_BYTE]))
    })

    bytes[bytes.length-1] = Buffer.from([PATHSET_END_BYTE])

    return new PathSet(Buffer.concat(bytes))
  }

  static fromParser(parser: BinaryParser): PathSet {
    let bytes: Array<Buffer> = []

    while(!parser.end()) {
      bytes.push(Path.fromParser(parser).toBytes());
      bytes.push(parser.read(1))

      if(bytes[bytes.length-1][0] == PATHSET_END_BYTE) {
        break;
      }
    }

    return new PathSet(Buffer.concat(bytes));
  }
  
  toJSON(): Array<Array<HopObject>> {
    let json: Array<Array<HopObject>> = []
    let pathParser = new BinaryParser(this.bytes.toString('hex'));

    while(!pathParser.end()) {
      json.push(Path.fromParser(pathParser).toJSON())
      pathParser.skip(1);
    }

    return json;
  }
}

export { PathSet };
