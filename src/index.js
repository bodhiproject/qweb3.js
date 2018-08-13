const Qweb3 = require('./qweb3');
const Encoder = require('./formatters/encoder');
const Decoder = require('./formatters/decoder');
const Utils = require('./utils');

// Attach Qweb3 to window
if (typeof window !== 'undefined' && typeof window.Qweb3 === 'undefined') {
  window.Qweb3 = Qweb3;
}

module.exports = {
  Qweb3,
  Encoder,
  Decoder,
  Utils,
};
