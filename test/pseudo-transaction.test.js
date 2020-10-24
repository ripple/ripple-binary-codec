const { encode, decode } = require("../dist");

const expect = require('chai').expect

let json = {
  Account: "rrrrrrrrrrrrrrrrrrrrrhoLvTp",
  Sequence: 0,
  Fee: "0",
  SigningPubKey: "",
  Signature: "",
};

let json_blank_acct = {
  Account: "",
  Sequence: 0,
  Fee: "0",
  SigningPubKey: "",
  Signature: "",
};

let binary =
  "24000000006840000000000000007300760081140000000000000000000000000000000000000000";

describe("Can encode Pseudo Transactions", () => {
  it("Correctly encodes Pseudo Transaciton", () => {
    expect(encode(json)).to.eql(binary);
  });

  it("Can decode account objects", () => {
    expect(decode(encode(json))).to.eql(json);
  });

  it("Blank AccountID is ACCOUNT_ZERO", () => {
    expect(encode(json_blank_acct)).to.eql(binary);
  });

  it("Decodes Blank AccountID", () => {
    expect(decode(encode(json_blank_acct))).to.eql(json);
  });
});
