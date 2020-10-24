const { coreTypes } = require("../dist/types");
const { Amount } = coreTypes;
const fixtures = require("./fixtures/data-driven-tests.json");

const expect = require('chai').expect;

function amountErrorTests() {
  fixtures.values_tests
    .filter((obj) => obj.type === "Amount")
    .forEach((f) => {
      // We only want these with errors
      if (!f.error) {
        return;
      }
      const testName =
        `${JSON.stringify(f.test_json)}\n\tis invalid ` + `because: ${f.error}`;
      it(testName, () => {
        expect(() => {
          Amount.from(f.test_json);
          JSON.stringify(f.test_json);
        }).to.throw();
      });
    });
}

describe("Amount", function () {
  it("can be parsed from", function () {
    expect(Amount.from("1000000") instanceof Amount).to.eql(true);
    expect(Amount.from("1000000").toJSON()).to.eql("1000000");
    const fixture = {
      value: "1",
      issuer: "0000000000000000000000000000000000000000",
      currency: "USD",
    };
    const amt = Amount.from(fixture);
    const rewritten = {
      value: "1",
      issuer: "rrrrrrrrrrrrrrrrrrrrrhoLvTp",
      currency: "USD",
    };
    expect(amt.toJSON()).to.eql(rewritten);
  });
  amountErrorTests();
});
