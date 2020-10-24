const { coreTypes } = require("../dist/types");
const { Hash160, Hash256, AccountID, Currency } = coreTypes;

const expect = require('chai').expect

describe("Hash160", function () {
  it("has a static width member", function () {
    expect(Hash160.width).to.eql(20);
  });
  it("inherited by subclasses", function () {
    expect(AccountID.width).to.eql(20);
    expect(Currency.width).to.eql(20);
  });
  it("can be compared against another", function () {
    const h1 = Hash160.from("1000000000000000000000000000000000000000");
    const h2 = Hash160.from("2000000000000000000000000000000000000000");
    const h3 = Hash160.from("0000000000000000000000000000000000000003");
    expect(h1.lt(h2)).to.eql(true);
    expect(h3.lt(h2)).to.eql(true);
  });
  it("throws when constructed from invalid hash length", () => {
    expect(() =>
      Hash160.from("10000000000000000000000000000000000000")
    ).to.throw("Invalid Hash length 19");
    expect(() =>
      Hash160.from("100000000000000000000000000000000000000000")
    ).to.throw("Invalid Hash length 21");
  });
});

describe("Hash256", function () {
  it("has a static width member", function () {
    expect(Hash256.width).to.eql(32);
  });
  it("has a ZERO_256 member", function () {
    expect(Hash256.ZERO_256.toJSON()).to.eql(
      "0000000000000000000000000000000000000000000000000000000000000000"
    );
  });
  it("supports getting the nibblet values at given positions", function () {
    const h = Hash256.from(
      "1359BD0000000000000000000000000000000000000000000000000000000000"
    );
    expect(h.nibblet(0)).to.eql(0x1);
    expect(h.nibblet(1)).to.eql(0x3);
    expect(h.nibblet(2)).to.eql(0x5);
    expect(h.nibblet(3)).to.eql(0x9);
    expect(h.nibblet(4)).to.eql(0x0b);
    expect(h.nibblet(5)).to.eql(0xd);
  });
});

describe("Currency", function () {
  it("Will have a null iso() for dodgy XRP ", function () {
    const bad = Currency.from("0000000000000000000000005852500000000000");
    expect(bad.iso()).to.eql(undefined);
    expect(bad.isNative()).to.eql(false);
  });
  it("Currency with lowercase letters decode to hex", () => {
    expect(Currency.from("xRp").toJSON()).to.eql(
      "0000000000000000000000007852700000000000"
    );
  });
  it("Currency codes with symbols decode to hex", () => {
    expect(Currency.from("x|p").toJSON()).to.eql(
      "000000000000000000000000787C700000000000"
    );
  });
  it("Currency codes with uppercase and 0-9 decode to ISO codes", () => {
    expect(Currency.from("X8P").toJSON()).to.eql("X8P");
    expect(Currency.from("USD").toJSON()).to.eql("USD");
  });
  it("can be constructed from a Buffer", function () {
    const xrp = new Currency(Buffer.alloc(20));
    expect(xrp.iso()).to.eql("XRP");
  });
  it("throws on invalid reprs", function () {
    expect(() => Currency.from(Buffer.alloc(19))).to.throw();
    expect(() => Currency.from(1)).to.throw();
    expect(() =>
      Currency.from("00000000000000000000000000000000000000m")
    ).to.throw();
  });
});
