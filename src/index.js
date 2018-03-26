const Qweb3 = require('./qweb3');
const Contract = require('./contract');
const Decoder = require('./decoder');
const Utils = require('./utils');
const QAssert = require('../test/utils/qassert');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.Qweb3 === 'undefined') {
  window.Qweb3 = Qweb3;
}

module.exports = {
  Qweb3,
  Contract,
  Decoder,
  Utils,
  QAssert,
};
