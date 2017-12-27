import 'babel-polyfill';
import { assert } from 'chai';

const Encoder = require('../src/encoder');

describe('Encoder', function() {

  describe('addressToHex', function() {
    it('should convert a qtum address', async function() {
      assert.equal(await Encoder.addressToHex('qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy'), 
        '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3');
    });

    it('should pad a qtum hex address', async function() {
      assert.equal(await Encoder.addressToHex('17e7888aa7412a735f336d2f6d784caefabb6fa3'), 
        '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3');
    });

    it('can handle an address with a hex prefix', async function() {
      assert.equal(await Encoder.addressToHex('0x17e7888aa7412a735f336d2f6d784caefabb6fa3'), 
        '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3');
    });

    it('throws if address is undefined', async function() {
      assert.throws(() => Encoder.addressToHex(), Error);
    });
  });
});
