import { assert, expect } from 'chai';
const Decoder = require('../src/decoder');

describe('Decoder', function() {
  describe('toQtumAddress()', function() {
    it('returns the converted qtum address', function() {
      assert.equal(Decoder.toQtumAddress('17e7888aa7412a735f336d2f6d784caefabb6fa3', false), 
        'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy');
      assert.equal(Decoder.toQtumAddress('2a2ad24849bc061f0f7abee243ebdb584b0d11f1', true), 
        'QQSwne4oB1jmRXceHrs9tPGQmn7qjvSqyR');
    });

    it('throws if hexAddress is undefined or empty', function() {
      expect(() => Decoder.toQtumAddress()).to.throw();
      expect(() => Decoder.toQtumAddress('')).to.throw();
    });

    it('throws if hexAddress is not hex', function() {
      expect(() => Decoder.toQtumAddress('qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy')).to.throw();
    });
  });

  describe('removeHexPrefix()', function() {
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
