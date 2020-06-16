import { _ } from 'lodash';
import { strict as assert } from 'assert';
import { coreTypes } from '../dist/types';
import { SerializedType } from '../dist/types/serialized-type';

describe('SerializedType interfaces', () => {
  _.forOwn(coreTypes, (Value, name) => {
    test(`${name} has a \`from\` static constructor`, () => {
      assert(Value.from && Value.from !== Array.from);
    });
    test(`${name} has a default constructor`, () => {
      /* eslint-disable no-new*/
      new Value();
      /* eslint-enable no-new*/
    });
    test(`${name}.from will return the same object`, () => {
      const instance = new Value();
      expect(Value.from(instance) === instance).toBe(true);
    });
    test(`${name} instances have toBytesSink`, () => {
      expect(new Value().toBytesSink).not.toBe(undefined);
    });
    test(`${name} instances have toJSON`, () => {
      expect(new Value().toJSON).not.toBe(undefined);
    });
    test(`${name}.from(json).toJSON() == json`, () => {
      const newJSON = new Value().toJSON();
      expect(Value.from(newJSON).toJSON()).toEqual(newJSON);
    });
    describe(`${name} supports all methods of the SerializedType mixin`, () => {
      _.keys(SerializedType).forEach(k => {
        test(`new ${name}.prototype.${k} !== undefined`, () => {
          expect(Value.prototype[k]).not.toBe(undefined);
        });
      });
    });
  });
});
