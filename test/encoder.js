import 'babel-polyfill';
import { assert } from 'chai';

const Encoder = require('../src/encoder');

describe('Encoder', function() {

  describe('getFunctionHash', function() {
    const funcObj = {"constant": false,"inputs": [{"name": "_resultIndex","type": "uint8"},{"name": "_sender","type": "address"},{"name": "_amount","type": "uint256"}],"name": "voteFromOracle","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"};

    it('should convert a function obj to hash string', async function() {
      const hash = await Encoder.getFunctionHash(funcObj);
      assert.equal(hash, '006a8a32');
      assert.equal(hash.length, 8);
    });

    it('throws if methodObj is undefined', async function() {
      assert.throws(() => Encoder.getFunctionHash(), Error);
      assert.throws(() => Encoder.getFunctionHash(undefined), Error);
    });
  });

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

  describe('padHexString', function() {
    it('should pad an existing hex string', async function() {
      var paddedStr = await Encoder.padHexString('5f5e100');
      assert.equal(paddedStr, '0000000000000000000000000000000000000000000000000000000005f5e100');
      assert.equal(paddedStr.length, 64);

      paddedStr = await Encoder.padHexString('0x5f5e100');
      assert.equal(paddedStr, '0000000000000000000000000000000000000000000000000000000005f5e100');
      assert.equal(paddedStr.length, 64);
    });

    it('throws if hexStr is undefined', async function() {
      assert.throws(() => Encoder.padHexString(), Error);
      assert.throws(() => Encoder.padHexString(undefined), Error);
    });

    it('throws if hexStr is not hex', async function() {
      assert.throws(() => Encoder.padHexString('hello world'), Error);
    });
  });
});
