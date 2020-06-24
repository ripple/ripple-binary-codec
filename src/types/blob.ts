import { makeClass } from "../utils/make-class";
import { parseBytes } from "../utils/bytes-utils";
import { SerializedType } from "./serialized-type";

const Blob = makeClass(
  {
    mixins: SerializedType,
    Blob(bytes) {
      if (bytes) {
        this._bytes = parseBytes(bytes, Uint8Array);
      } else {
        this._bytes = new Uint8Array(0);
      }
    },
    statics: {
      fromParser(parser, hint) {
        return new this(parser.read(hint));
      },
      from(value) {
        if (value instanceof this) {
          return value;
        }
        return new this(value);
      },
    },
  },
  undefined
);

export { Blob };
