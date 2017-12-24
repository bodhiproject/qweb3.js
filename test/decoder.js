const Decoder = require('../src/decoder');
const assert = require('assert');

describe('Decoder', function() {
  describe('toQtumAddress()', function() {
    it('returns the converted qtum address', function() {
      let qtumAddr = Decoder.toQtumAddress('17e7888aa7412a735f336d2f6d784caefabb6fa3');
      assert.equal(qtumAddr, 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy');
    });
  });
});
