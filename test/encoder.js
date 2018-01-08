import {
  assert
} from 'chai';
import BN from 'bn.js';
import Web3Utils from 'web3-utils';

import Encoder from '../src/encoder';

describe('Encoder', function() {
  const UINT256_MAX = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
  const UINT256_MIN = '0';
  const INT256_MAX = '57896044618658097711785492504343953926634992332820282019728792003956564819967';
  const INT256_MIN = '-57896044618658097711785492504343953926634992332820282019728792003956564819968';

  describe('getFunctionHash()', function() {
    const funcObj = {
      "constant": false,
      "inputs": [{
        "name": "_resultIndex",
        "type": "uint8"
      }, {
        "name": "_sender",
        "type": "address"
      }, {
        "name": "_amount",
        "type": "uint256"
      }],
      "name": "voteFromOracle",
      "outputs": [{
        "name": "",
        "type": "bool"
      }],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    };

    it('should convert a function obj to hash string', function() {
      const hash = Encoder.getFunctionHash(funcObj);
      assert.equal(hash, '006a8a32');
      assert.equal(hash.length, 8);
    });

    it('throws if methodObj is undefined', function() {
      assert.throws(() => Encoder.getFunctionHash(), Error);
      assert.throws(() => Encoder.getFunctionHash(undefined), Error);
    });
  });

  describe('addressToHex()', function() {
    it('should convert a qtum address', function() {
      assert.equal(Encoder.addressToHex('qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy'),
        '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3');
      assert.equal(Encoder.addressToHex('qKoxAUEQ1Nj6anwes6ZjRGQ7aqdiyUeat8'),
        '00000000000000000000000018b1a0dc71e4de23c20dc4163f9696d2d9d63868');
      assert.equal(Encoder.addressToHex('qTumW1fRyySwmoPi12LpFyeRj8W6mzUQA3'),
        '000000000000000000000000718c3ab4d6a28c92c570a1c12bfc17c3512bb05b');
    });

    it('should pad a hex address', function() {
      assert.equal(Encoder.addressToHex('17e7888aa7412a735f336d2f6d784caefabb6fa3'),
        '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3');
      assert.equal(Encoder.addressToHex('18b1a0dc71e4de23c20dc4163f9696d2d9d63868'),
        '00000000000000000000000018b1a0dc71e4de23c20dc4163f9696d2d9d63868');
      assert.equal(Encoder.addressToHex('718c3ab4d6a28c92c570a1c12bfc17c3512bb05b'),
        '000000000000000000000000718c3ab4d6a28c92c570a1c12bfc17c3512bb05b');
    });

    it('can handle an address with a hex prefix', function() {
      assert.equal(Encoder.addressToHex('0x17e7888aa7412a735f336d2f6d784caefabb6fa3'),
        '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3');
      assert.equal(Encoder.addressToHex('0x18b1a0dc71e4de23c20dc4163f9696d2d9d63868'),
        '00000000000000000000000018b1a0dc71e4de23c20dc4163f9696d2d9d63868');
      assert.equal(Encoder.addressToHex('0x718c3ab4d6a28c92c570a1c12bfc17c3512bb05b'),
        '000000000000000000000000718c3ab4d6a28c92c570a1c12bfc17c3512bb05b');
    });

    it('throws if address is undefined', function() {
      assert.throws(() => Encoder.addressToHex(), Error);
    });
  });

  describe('boolToHex()', function() {
    it('should convert a bool to hex', function() {
      let hex = Encoder.boolToHex(true);
      assert.equal(hex, '0000000000000000000000000000000000000000000000000000000000000001');
      assert.equal(hex.length, 64);

      hex = Encoder.boolToHex(false);
      assert.equal(hex, '0000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, 64);

      hex = Encoder.boolToHex(1);
      assert.equal(hex, '0000000000000000000000000000000000000000000000000000000000000001');
      assert.equal(hex.length, 64);

      hex = Encoder.boolToHex(0);
      assert.equal(hex, '0000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, 64);
    });

    it('throws if value is undefined', function() {
      assert.throws(() => Encoder.boolToHex(undefined), Error);
      assert.throws(() => Encoder.boolToHex(), Error);
    });
  });

  describe('stringToHex()', function() {
    it('should convert a string to hex', function() {
      const hex = Encoder.stringToHex('Hello World', 640);
      assert.equal(hex, '48656c6c6f20576f726c64000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, 640);
    });

    it('only parses up to the maxCharLen', function() {
      const hex = Encoder.stringToHex('abc', 4); // 616263 in hex
      assert.equal(hex, '6162');
      assert.equal(hex.length, 4);
    });

    it('throws if string is undefined or not a String', function() {
      assert.throws(() => Encoder.stringToHex(undefined, 640), Error);
      assert.throws(() => Encoder.stringToHex(12345, 640), Error);
    });

    it('throws if maxCharLen is undefined or not a Number', function() {
      assert.throws(() => Encoder.stringToHex('Hello world!'), Error);
      assert.throws(() => Encoder.stringToHex('Hello world!', 'abc'), Error);
    });
  });

  describe('stringArrayToHex()', function() {
    it('should convert a string array to hex', function() {
      const hex = Encoder.stringArrayToHex(['a', 'b', 'c'], 10);
      assert.equal(hex, '6100000000000000000000000000000000000000000000000000000000000000620000000000000000000000000000000000000000000000000000000000000063000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, 64 * 10);
    });

    it('only parses the numOfItems', function() {
      const hex = Encoder.stringArrayToHex(['a', 'b', 'c', 'd'], 3);
      assert.equal(hex, '610000000000000000000000000000000000000000000000000000000000000062000000000000000000000000000000000000000000000000000000000000006300000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, 64 * 3);
    });

    it('throws if strArray is undefined or not an Array', function() {
      assert.throws(() => Encoder.stringArrayToHex(undefined, 10), Error);
      assert.throws(() => Encoder.stringArrayToHex('a', 10), Error);
    });

    it('throws if numOfItems is not a Number', function() {
      assert.throws(() => Encoder.stringArrayToHex(['a', 'b', 'c']), Error);
      assert.throws(() => Encoder.stringArrayToHex(['a', 'b', 'c'], 'a'), Error);
    });

    it('throws if numOfItems is <= 0', function() {
      assert.throws(() => Encoder.stringArrayToHex(['a', 'b', 'c'], 0), Error);
      assert.throws(() => Encoder.stringArrayToHex(['a', 'b', 'c'], -1), Error);
    });
  });

  describe('intToHex()', function() {
    it('should convert int to hex', function() {
      let hex = Encoder.intToHex(-1);
      assert.equal(hex, 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
      assert.equal(hex.length, 64);

      hex = Encoder.intToHex(1);
      assert.equal(hex, '0000000000000000000000000000000000000000000000000000000000000001');
      assert.equal(hex.length, 64);

      hex = Encoder.intToHex('-10000000000000000');
      assert.equal(hex, 'ffffffffffffffffffffffffffffffffffffffffffffffffffdc790d903f0000');
      assert.equal(hex.length, 64);

      hex = Encoder.intToHex('10000000000000000');
      assert.equal(hex, '000000000000000000000000000000000000000000000000002386f26fc10000');
      assert.equal(hex.length, 64);

      hex = Encoder.intToHex(INT256_MAX);
      assert.equal(hex, '7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
      assert.equal(hex.length, 64);

      hex = Encoder.intToHex(INT256_MIN);
      assert.equal(hex, '8000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, 64);

      hex = Encoder.intToHex(new BN(INT256_MAX));
      assert.equal(hex, '7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
      assert.equal(hex.length, 64);

      hex = Encoder.intToHex(new BN(INT256_MIN));
      assert.equal(hex, '8000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, 64);
    });

    it('throws if num is undefined', function() {
      assert.throws(() => Encoder.intToHex(undefined), Error);
      assert.throws(() => Encoder.intToHex(), Error);
    });
  });

  describe('uintToHex()', function() {
    it('should convert uint to hex', function() {
      let hex = Encoder.uintToHex(0);
      assert.equal(hex, '0000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, 64);

      hex = Encoder.uintToHex('1000000');
      assert.equal(hex, '00000000000000000000000000000000000000000000000000000000000f4240');
      assert.equal(hex.length, 64);

      hex = Encoder.uintToHex('2386f26fc10000');
      assert.equal(hex, '000000000000000000000000000000000000000000000000002386f26fc10000');
      assert.equal(hex.length, 64);

      hex = Encoder.uintToHex('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
      assert.equal(hex, 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
      assert.equal(hex.length, 64);

      hex = Encoder.uintToHex(new BN(UINT256_MAX));
      assert.equal(hex, 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
      assert.equal(hex.length, 64);

      hex = Encoder.uintToHex(new BN(UINT256_MIN));
      assert.equal(hex, '0000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, 64);
    });

    it('throws if num is undefined', function() {
      assert.throws(() => Encoder.uintToHex(undefined), Error);
      assert.throws(() => Encoder.uintToHex(), Error);
    });
  });

  describe('padHexString()', function() {
    it('should pad an existing hex string', function() {
      var paddedStr = Encoder.padHexString('5f5e100');
      assert.equal(paddedStr, '0000000000000000000000000000000000000000000000000000000005f5e100');
      assert.equal(paddedStr.length, 64);

      paddedStr = Encoder.padHexString('0x5f5e100');
      assert.equal(paddedStr, '0000000000000000000000000000000000000000000000000000000005f5e100');
      assert.equal(paddedStr.length, 64);
    });

    it('throws if hexStr is undefined', function() {
      assert.throws(() => Encoder.padHexString(), Error);
      assert.throws(() => Encoder.padHexString(undefined), Error);
    });

    it('throws if hexStr is not hex', function() {
      assert.throws(() => Encoder.padHexString('hello world'), Error);
    });
  });
});