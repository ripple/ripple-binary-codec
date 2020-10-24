const {
  transactionTreeHash,
  ledgerHash,
  accountStateHash,
} = require("../dist/ledger-hashes");

const expect = require('chai').expect

const ledger40000 = require("./fixtures/ledger-full-40000.json")
const ledger38129 = require("./fixtures/ledger-full-38129.json")

describe("Ledger Hashes", function () {
  function testFactory(ledger) {
    describe(`can calculate hashes for ${ledger.ledger_index}`, function () {
      it("computes correct account state hash", function () {
        expect(accountStateHash(ledger.accountState).toHex()).to.eql(
          ledger.account_hash
        );
      });
      it("computes correct transaction tree hash", function () {
        expect(transactionTreeHash(ledger.transactions).toHex()).to.eql(
          ledger.transaction_hash
        );
      });
      it("computes correct ledger header hash", function () {
        expect(ledgerHash(ledger).toHex()).to.eql(ledger.hash);
      });
    });
  }
  testFactory(ledger40000);
  testFactory(ledger38129);
});
