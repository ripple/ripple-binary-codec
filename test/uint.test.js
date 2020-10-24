const { coreTypes } = require("../dist/types");
const { UInt8, UInt64 } = coreTypes;

const expect = require('chai').expect

describe("UInt tests", function () {
  it("compareToTests[0]", () => {
    expect(UInt8.from(124).compareTo(UInt64.from(124))).to.eql(0);
  });

  it("compareToTest[1]", () => {
    expect(UInt64.from(124).compareTo(UInt8.from(124))).to.eql(0);
  });

  it("compareToTest[2]", () => {
    expect(UInt64.from(124).compareTo(UInt8.from(123))).to.eql(1);
  });

  it("compareToTest[3]", () => {
    expect(UInt8.from(124).compareTo(UInt8.from(13))).to.eql(1);
  });

  it("compareToTest[4]", () => {
    expect(UInt8.from(124).compareTo(124)).to.eql(0);
  });

  it("compareToTest[5]", () => {
    expect(UInt64.from(124).compareTo(124)).to.eql(0);
  });

  it("compareToTest[6]", () => {
    expect(UInt64.from(124).compareTo(123)).to.eql(1);
  });

  it("compareToTest[7]", () => {
    expect(Buffer.from("33333333", 'hex').readUInt32BE()).to.eql(858993459)
    expect(UInt8.from(124).compareTo(13)).to.eql(1);
  });

  it("valueOfTests", () => {
    let val = UInt8.from(1);
    val |= 0x2;
    expect(val).to.eql(3);
  })
})
