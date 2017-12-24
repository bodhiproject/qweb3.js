const assert = require('chai').assert;
const Decoder = require('../src/decoder');

describe('Decoder', function() {
  describe('toQtumAddress()', function() {
    it('returns the converted qtum address', function() {
      let qtumAddr = Decoder.toQtumAddress('17e7888aa7412a735f336d2f6d784caefabb6fa3');
      assert.equal(qtumAddr, 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy');
    });
  });

  describe('removeHexPrefix', function() {
    it('returns the value without the hex prefix', function() {
      const hexValue = '0x1111111111111111111111111111111111111111';
      assert.equal(Decoder.removeHexPrefix(hexValue), hexValue.slice(2));
    });

    it('returns the array values with hex prefixes', function() {
      const hexArray = ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'];
      const expected = [hexArray[0].slice(2), hexArray[1].slice(2)];
      assert.deepEqual(Decoder.removeHexPrefix(hexArray), expected);
    });
  });
});
