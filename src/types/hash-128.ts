import { makeClass } from '../utils/make-class';
const {Hash} = require('./hash');

const Hash128 = makeClass({
  inherits: Hash,
  statics: {width: 16}
}, undefined);

export {
  Hash128
};
