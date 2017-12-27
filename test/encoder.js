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

  describe('stringToHex', function() {
    it('should convert a string to hex', async function() {
      const hex = await Encoder.stringToHex('Hello World', 640);
      assert.equal(hex, '48656c6c6f20576f726c64000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, 640);
    });

    it('throws if string is undefined or not a String', async function() {
      assert.throws(() => Encoder.stringToHex(undefined, 640), Error);
      assert.throws(() => Encoder.stringToHex(12345, 640), Error);
    });

    it('throws if maxCharLen is undefined or not a Number', async function() {
      assert.throws(() => Encoder.stringToHex('Hello world!'), Error);
      assert.throws(() => Encoder.stringToHex('Hello world!', 'abc'), Error);
    });
  });

  describe('stringArrayToHex', function() {
    it('should convert a string array to hex', async function() {
      const hex = await Encoder.stringArrayToHex(['a', 'b', 'c'], 10);
      assert.equal(hex, '6100000000000000000000000000000000000000000000000000000000000000620000000000000000000000000000000000000000000000000000000000000063000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, 640);
    });

    it('throws if strArray is undefined or not an Array', async function() {
      assert.throws(() => Encoder.stringArrayToHex(undefined, 10), Error);
      assert.throws(() => Encoder.stringArrayToHex('a', 10), Error);
    });

    it('throws if numOfItems is not a Number', async function() {
      assert.throws(() => Encoder.stringArrayToHex(['a', 'b', 'c']), Error);
      assert.throws(() => Encoder.stringArrayToHex(['a', 'b', 'c'], 'a'), Error);
    });

    it('throws if numOfItems is <= 0', async function() {
      assert.throws(() => Encoder.stringArrayToHex(['a', 'b', 'c'], 0), Error);
      assert.throws(() => Encoder.stringArrayToHex(['a', 'b', 'c'], -1), Error);
    });
  });

  describe('uintToHex', function() {
    it('should convert a uint to hex', async function() {
      const hex = await Encoder.uintToHex(1000000);
      assert.equal(hex.toLowerCase(), '00000000000000000000000000000000000000000000000000000000000f4240');
      assert.equal(hex.length, 64);
    });

    it('throws if num is undefined or not a Number', async function() {
      assert.throws(() => Encoder.uintToHex(), Error);
      assert.throws(() => Encoder.uintToHex('a'), Error);
    });
  });
});
