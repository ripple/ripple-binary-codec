/* eslint-disable func-style */

const { binary } = require("../dist/coretypes");
const { encode, decode } = require("../dist");
const { makeParser, BytesList, BinarySerializer } = binary;
const { coreTypes } = require("../dist/types");
const { UInt8, UInt16, UInt32, UInt64, STObject } = coreTypes;
const bigInt = require("big-integer");

const fixtures = require("./fixtures/data-driven-tests.json");
const deliverMinTx = require("./fixtures/delivermin-tx.json");
const deliverMinTxBinary = require("./fixtures/delivermin-tx-binary.json");
const SignerListSet = {
  tx: require("./fixtures/signerlistset-tx.json"),
  binary: require("./fixtures/signerlistset-tx-binary.json"),
  meta: require("./fixtures/signerlistset-tx-meta-binary.json"),
};
const DepositPreauth = {
  tx: require("./fixtures/deposit-preauth-tx.json"),
  binary: require("./fixtures/deposit-preauth-tx-binary.json"),
  meta: require("./fixtures/deposit-preauth-tx-meta-binary.json"),
};
const Escrow = {
  create: {
    tx: require("./fixtures/escrow-create-tx.json"),
    binary: require("./fixtures/escrow-create-binary.json"),
  },
  finish: {
    tx: require("./fixtures/escrow-finish-tx.json"),
    binary: require("./fixtures/escrow-finish-binary.json"),
    meta: require("./fixtures/escrow-finish-meta-binary.json"),
  },
  cancel: {
    tx: require("./fixtures/escrow-cancel-tx.json"),
    binary: require("./fixtures/escrow-cancel-binary.json"),
  },
};
const PaymentChannel = {
  create: {
    tx: require("./fixtures/payment-channel-create-tx.json"),
    binary: require("./fixtures/payment-channel-create-binary.json"),
  },
  fund: {
    tx: require("./fixtures/payment-channel-fund-tx.json"),
    binary: require("./fixtures/payment-channel-fund-binary.json"),
  },
  claim: {
    tx: require("./fixtures/payment-channel-claim-tx.json"),
    binary: require("./fixtures/payment-channel-claim-binary.json"),
  },
};

let json_undefined = {
  TakerPays: "223174650",
  Account: "rPk2dXr27rMw9G5Ej9ad2Tt7RJzGy8ycBp",
  TransactionType: "OfferCreate",
  Memos: [
    {
      Memo: {
        MemoType: "584D4D2076616C7565",
        MemoData: "322E3230393635",
        MemoFormat: undefined,
      },
    },
  ],
  Fee: "15",
  OfferSequence: undefined,
  TakerGets: {
    currency: "XMM",
    value: "100",
    issuer: "rExAPEZvbkZqYPuNcZ7XEBLENEshsWDQc8",
  },
  Flags: 524288,
  Sequence: undefined,
  LastLedgerSequence: 6220135,
};

let json_omitted = {
  TakerPays: "223174650",
  Account: "rPk2dXr27rMw9G5Ej9ad2Tt7RJzGy8ycBp",
  TransactionType: "OfferCreate",
  Memos: [
    {
      Memo: {
        MemoType: "584D4D2076616C7565",
        MemoData: "322E3230393635",
      },
    },
  ],
  Fee: "15",
  TakerGets: {
    currency: "XMM",
    value: "100",
    issuer: "rExAPEZvbkZqYPuNcZ7XEBLENEshsWDQc8",
  },
  Flags: 524288,
  LastLedgerSequence: 6220135,
};

const NegativeUNL = require("./fixtures/negative-unl.json");
const expect = require('chai').expect

function bytesListTest() {
  const list = new BytesList()
    .put(Buffer.from([0]))
    .put(Buffer.from([2, 3]))
    .put(Buffer.from([4, 5]));
  it("is an Array<Buffer>", function () {
    expect(Array.isArray(list.bytesArray)).to.eql(true);
    expect(list.bytesArray[0] instanceof Buffer).to.eql(true);
  });
  it("keeps track of the length itself", function () {
    expect(list.getLength()).to.eql(5);
  });
  it("can join all arrays into one via toBytes", function () {
    const joined = list.toBytes();
    expect(joined.length).to.eql(5);
    expect(joined).to.eql(Buffer.from([0, 2, 3, 4, 5]));
  });
}

function assertRecycles(blob) {
  const parser = makeParser(blob);
  const so = parser.readType(STObject);
  const out = new BytesList();
  so.toBytesSink(out);
  const hex = out.toHex();
  expect(hex).to.eql(blob);
  expect(hex + ":").not.to.eql(blob);
}

function nestedObjectTests() {
  fixtures.whole_objects.forEach((f, i) => {
    /*eslint-disable jest/expect-expect*/
    it(`whole_objects[${i}]: can parse blob and dump out same blob`, () => {
      assertRecycles(f.blob_with_no_signing);
    });
    /*eslint-enable jest/expect-expect*/
  });
}

function serializeUInt() {
  function check(type, n, expected) {
    it(`Uint${type.width * 8} serializes ${n} as ${expected}`, function () {
      const bl = new BytesList();
      const serializer = new BinarySerializer(bl);
      if (expected === "throws") {
        expect(() => serializer.writeType(type, n)).to.throw();
        return;
      }
      serializer.writeType(type, n);
      expect(bl.toBytes()).to.eql(Buffer.from(expected));
    });
}

  check(UInt8, 5, [5]);
  check(UInt16, 5, [0, 5]);
  check(UInt32, 5, [0, 0, 0, 5]);
  check(UInt32, 0xffffffff, [255, 255, 255, 255]);
  check(UInt8, 0xfeffffff, "throws");
  check(UInt16, 0xfeffffff, "throws");
  check(UInt16, 0xfeffffff, "throws");
  check(UInt64, 0xfeffffff, [0, 0, 0, 0, 254, 255, 255, 255]);
  check(UInt64, -1, "throws");
  check(UInt64, 0, [0, 0, 0, 0, 0, 0, 0, 0]);
  check(UInt64, 1, [0, 0, 0, 0, 0, 0, 0, 1]);
  check(UInt64, bigInt(1), [0, 0, 0, 0, 0, 0, 0, 1]);
}

function deliverMinTest() {
  it("can serialize DeliverMin", () => {
    expect(encode(deliverMinTx)).to.eql(deliverMinTxBinary);
  });
}

function SignerListSetTest() {
  it("can serialize SignerListSet", () => {
    expect(encode(SignerListSet.tx)).to.eql(SignerListSet.binary);
  });
  it("can serialize SignerListSet metadata", () => {
    expect(encode(SignerListSet.tx.meta)).to.eql(SignerListSet.meta);
  });
}

function DepositPreauthTest() {
  it("can serialize DepositPreauth", () => {
    expect(encode(DepositPreauth.tx)).to.eql(DepositPreauth.binary);
  });
  it("can serialize DepositPreauth metadata", () => {
    expect(encode(DepositPreauth.tx.meta)).to.eql(DepositPreauth.meta);
  });
}

function EscrowTest() {
  it("can serialize EscrowCreate", () => {
    expect(encode(Escrow.create.tx)).to.eql(Escrow.create.binary);
  });
  it("can serialize EscrowFinish", () => {
    expect(encode(Escrow.finish.tx)).to.eql(Escrow.finish.binary);
    expect(encode(Escrow.finish.tx.meta)).to.eql(Escrow.finish.meta);
  });
  it("can serialize EscrowCancel", () => {
    expect(encode(Escrow.cancel.tx)).to.eql(Escrow.cancel.binary);
  });
}

function PaymentChannelTest() {
  it("can serialize PaymentChannelCreate", () => {
    expect(encode(PaymentChannel.create.tx)).to.eql(
      PaymentChannel.create.binary
    );
  });
  it("can serialize PaymentChannelFund", () => {
    expect(encode(PaymentChannel.fund.tx)).to.eql(PaymentChannel.fund.binary);
  });
  it("can serialize PaymentChannelClaim", () => {
    expect(encode(PaymentChannel.claim.tx)).to.eql(
      PaymentChannel.claim.binary
    );
  });
}

function NegativeUNLTest() {
  it("can serialize NegativeUNL", () => {
    expect(encode(NegativeUNL.tx)).to.eql(NegativeUNL.binary);
  });
  it("can deserialize NegativeUNL", () => {
    expect(decode(NegativeUNL.binary)).to.eql(NegativeUNL.tx);
  });
}

function omitUndefinedTest() {
  it("omits fields with undefined value", () => {
    let encodedOmitted = encode(json_omitted);
    let encodedUndefined = encode(json_undefined);
    expect(encodedOmitted).to.eql(encodedUndefined);
    expect(decode(encodedOmitted)).to.eql(decode(encodedUndefined));
  });
}

describe("Binary Serialization", function () {
  describe("nestedObjectTests", () => nestedObjectTests());
  describe("BytesList", () => bytesListTest());
  describe("Serialize/Deserialize UInt", () => serializeUInt())
  describe("DeliverMin", () => deliverMinTest());
  describe("DepositPreauth", () => DepositPreauthTest());
  describe("SignerListSet", () => SignerListSetTest());
  describe("Escrow", () => EscrowTest());
  describe("PaymentChannel", () => PaymentChannelTest());
  describe("NegativeUNLTest", () => NegativeUNLTest());
  describe("OmitUndefined", () => omitUndefinedTest());
});
