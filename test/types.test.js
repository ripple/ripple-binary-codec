const { coreTypes } = require("../dist/types");
const { SerializedType } = require("../dist/types/serialized-type");

const expect = require('chai').expect

describe("SerializedType interfaces", () => {
  Object.entries(coreTypes).forEach(([name, Value]) => {
    it(`${name} has a \`from\` static constructor`, () => {
      expect(Value.from && Value.from !== Array.from).to.eql(true);
    });
    it(`${name} has a default constructor`, () => {
      expect(new Value()).not.to.eql(undefined);
    });
    it(`${name}.from will return the same object`, () => {
      const instance = new Value();
      expect(Value.from(instance) === instance).to.eql(true);
    });
    it(`${name} instances have toBytesSink`, () => {
      expect(new Value().toBytesSink).not.to.eql(undefined);
    });
    it(`${name} instances have toJSON`, () => {
      expect(new Value().toJSON).not.to.eql(undefined);
    });
    it(`${name}.from(json).toJSON() == json`, () => {
      const newJSON = new Value().toJSON();
      expect(Value.from(newJSON).toJSON()).to.eql(newJSON);
    });
    describe(`${name} supports all methods of the SerializedType mixin`, () => {
      Object.keys(SerializedType.prototype).forEach((k) => {
        it(`new ${name}.prototype.${k} !== undefined`, () => {
          expect(Value.prototype[k]).not.to.eql(undefined);
        });
      });
    });
  });
});
