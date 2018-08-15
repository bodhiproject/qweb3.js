/* eslint-disable no-underscore-dangle, max-len */
const chai = require('chai');
const BN = require('bn.js');
const BigNumber = require('bignumber.js');

const Encoder = require('../encoder');
const ContractMetadata = require('../../../test/data/contract_metadata');

const { assert } = chai;
const PADDED_BYTES = 64;

describe('Encoder', () => {
  const UINT256_MAX = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
  const UINT256_MIN = '0';
  const INT256_MAX = '57896044618658097711785492504343953926634992332820282019728792003956564819967';
  const INT256_MIN = '-57896044618658097711785492504343953926634992332820282019728792003956564819968';

  describe('objToHash()', () => {
    it('should convert an event obj to hash string', () => {
      let eventObj = {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: '_version',
            type: 'uint16',
          },
          {
            indexed: true,
            name: '_topicAddress',
            type: 'address',
          },
          {
            indexed: false,
            name: '_name',
            type: 'bytes32[10]',
          },
          {
            indexed: false,
            name: '_resultNames',
            type: 'bytes32[10]',
          },
        ],
        name: 'TopicCreated',
        type: 'event',
      };

      let hash = Encoder.objToHash(eventObj, false);
      assert.equal(hash, '83b9cf916e58a51bacb9cfa2e56de173d9757e8ef33a56b89cf1a7e52fff4338');
      assert.equal(hash.length, PADDED_BYTES);

      eventObj = {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: '_version',
            type: 'uint16',
          },
          {
            indexed: true,
            name: '_contractAddress',
            type: 'address',
          },
          {
            indexed: true,
            name: '_eventAddress',
            type: 'address',
          },
          {
            indexed: false,
            name: '_numOfResults',
            type: 'uint8',
          },
          {
            indexed: false,
            name: '_oracle',
            type: 'address',
          },
          {
            indexed: false,
            name: '_bettingStartBlock',
            type: 'uint256',
          },
          {
            indexed: false,
            name: '_bettingEndBlock',
            type: 'uint256',
          },
          {
            indexed: false,
            name: '_resultSettingStartBlock',
            type: 'uint256',
          },
          {
            indexed: false,
            name: '_resultSettingEndBlock',
            type: 'uint256',
          },
          {
            indexed: false,
            name: '_consensusThreshold',
            type: 'uint256',
          },
        ],
        name: 'CentralizedOracleCreated',
        type: 'event',
      };
      hash = Encoder.objToHash(eventObj, false);
      assert.equal(hash, '1e482c6081e57445e988bc379f3066a27d0db9fb8d6c9fb9aeff950cec4c1897');
      assert.equal(hash.length, PADDED_BYTES);
    });

    it('should convert a function obj to hash string', () => {
      const funcObj = {
        constant: false,
        inputs: [{
          name: '_resultIndex',
          type: 'uint8',
        }, {
          name: '_sender',
          type: 'address',
        }, {
          name: '_amount',
          type: 'uint256',
        }],
        name: 'voteFromOracle',
        outputs: [{
          name: '',
          type: 'bool',
        }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      };

      const hash = Encoder.objToHash(funcObj, true);
      assert.equal(hash, '006a8a32');
      assert.equal(hash.length, 8);
    });

    it('throws if obj is undefined', () => {
      assert.throws(() => Encoder.objToHash(undefined, false), Error);
    });

    it('throws if isFunction is undefined', () => {
      assert.throws(() => Encoder.objToHash(undefined, true), Error);
    });
  });

  describe('addressToHex()', () => {
    it('should convert a qtum address', () => {
      assert.equal(
        Encoder.addressToHex('qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy'),
        '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3',
      );
      assert.equal(
        Encoder.addressToHex('qKoxAUEQ1Nj6anwes6ZjRGQ7aqdiyUeat8'),
        '00000000000000000000000018b1a0dc71e4de23c20dc4163f9696d2d9d63868',
      );
      assert.equal(
        Encoder.addressToHex('qTumW1fRyySwmoPi12LpFyeRj8W6mzUQA3'),
        '000000000000000000000000718c3ab4d6a28c92c570a1c12bfc17c3512bb05b',
      );
    });

    it('should pad a hex address', () => {
      assert.equal(
        Encoder.addressToHex('17e7888aa7412a735f336d2f6d784caefabb6fa3'),
        '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3',
      );
      assert.equal(
        Encoder.addressToHex('18b1a0dc71e4de23c20dc4163f9696d2d9d63868'),
        '00000000000000000000000018b1a0dc71e4de23c20dc4163f9696d2d9d63868',
      );
      assert.equal(
        Encoder.addressToHex('718c3ab4d6a28c92c570a1c12bfc17c3512bb05b'),
        '000000000000000000000000718c3ab4d6a28c92c570a1c12bfc17c3512bb05b',
      );
    });

    it('can handle an address with a hex prefix', () => {
      assert.equal(
        Encoder.addressToHex('0x17e7888aa7412a735f336d2f6d784caefabb6fa3'),
        '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3',
      );
      assert.equal(
        Encoder.addressToHex('0x18b1a0dc71e4de23c20dc4163f9696d2d9d63868'),
        '00000000000000000000000018b1a0dc71e4de23c20dc4163f9696d2d9d63868',
      );
      assert.equal(
        Encoder.addressToHex('0x718c3ab4d6a28c92c570a1c12bfc17c3512bb05b'),
        '000000000000000000000000718c3ab4d6a28c92c570a1c12bfc17c3512bb05b',
      );
    });

    it('throws if address is undefined', () => {
      assert.throws(() => Encoder.addressToHex(), Error);
    });
  });

  describe('boolToHex()', () => {
    it('should convert a bool to hex', () => {
      let hex = Encoder.boolToHex(true);
      assert.equal(hex, '0000000000000000000000000000000000000000000000000000000000000001');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.boolToHex(false);
      assert.equal(hex, '0000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.boolToHex(1);
      assert.equal(hex, '0000000000000000000000000000000000000000000000000000000000000001');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.boolToHex(0);
      assert.equal(hex, '0000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, PADDED_BYTES);
    });

    it('throws if value is undefined', () => {
      assert.throws(() => Encoder.boolToHex(undefined), Error);
      assert.throws(() => Encoder.boolToHex(), Error);
    });
  });

  describe('stringToHex()', () => {
    it('should convert a string to hex', () => {
      const hex = Encoder.stringToHex('Hello World', PADDED_BYTES * 10);
      assert.equal(hex, '48656c6c6f20576f726c64000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, PADDED_BYTES * 10);
    });

    it('parses up to the maxCharLen', () => {
      const hex = Encoder.stringToHex('abc', 4); // 616263 in hex
      assert.equal(hex, '6162');
      assert.equal(hex.length, 4);
    });

    it('throws if string is undefined or not a String', () => {
      assert.throws(() => Encoder.stringToHex(undefined, PADDED_BYTES * 10), Error);
      assert.throws(() => Encoder.stringToHex(12345, PADDED_BYTES * 10), Error);
    });

    it('throws if maxCharLen is undefined or not a Number', () => {
      assert.throws(() => Encoder.stringToHex('Hello world!'), Error);
      assert.throws(() => Encoder.stringToHex('Hello world!', 'abc'), Error);
    });

    it('converts pure numbers correctly', () => {
      const hex = Encoder.stringToHex('2017', PADDED_BYTES); // 616263 in hex
      assert.equal(hex, '3230313700000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, PADDED_BYTES);
    });
  });

  describe('stringArrayToHex()', () => {
    it('should convert a string array to hex', () => {
      const hex = Encoder.stringArrayToHex(['a', 'b', 'c'], 10);
      assert.equal(hex, '6100000000000000000000000000000000000000000000000000000000000000620000000000000000000000000000000000000000000000000000000000000063000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, PADDED_BYTES * 10);
    });

    it('parses the numOfItems defined', () => {
      const hex = Encoder.stringArrayToHex(['a', 'b', 'c', 'd'], 3);
      assert.equal(hex, '610000000000000000000000000000000000000000000000000000000000000062000000000000000000000000000000000000000000000000000000000000006300000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, PADDED_BYTES * 3);
    });

    it('throws if strArray is undefined or not an Array', () => {
      assert.throws(() => Encoder.stringArrayToHex(undefined, 10), Error);
      assert.throws(() => Encoder.stringArrayToHex('a', 10), Error);
    });

    it('throws if numOfItems is not a Number', () => {
      assert.throws(() => Encoder.stringArrayToHex(['a', 'b', 'c']), Error);
      assert.throws(() => Encoder.stringArrayToHex(['a', 'b', 'c'], 'a'), Error);
    });

    it('throws if numOfItems is <= 0', () => {
      assert.throws(() => Encoder.stringArrayToHex(['a', 'b', 'c'], 0), Error);
      assert.throws(() => Encoder.stringArrayToHex(['a', 'b', 'c'], -1), Error);
    });

    it('converts pure numbers correctly', () => {
      const hex = Encoder.stringArrayToHex(['2017', '2018', '2019'], 3);
      assert.equal(hex, '323031370000000000000000000000000000000000000000000000000000000032303138000000000000000000000000000000000000000000000000000000003230313900000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, PADDED_BYTES * 3);
    });
  });

  describe('intToHex()', () => {
    it('should convert int to hex', () => {
      let hex = Encoder.intToHex(-1);
      assert.equal(hex, 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.intToHex(1);
      assert.equal(hex, '0000000000000000000000000000000000000000000000000000000000000001');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.intToHex('-10000000000000000');
      assert.equal(hex, 'ffffffffffffffffffffffffffffffffffffffffffffffffffdc790d903f0000');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.intToHex('10000000000000000');
      assert.equal(hex, '000000000000000000000000000000000000000000000000002386f26fc10000');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.intToHex('0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
      assert.equal(hex, '7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.intToHex('0x8000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex, '8000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.intToHex(INT256_MAX);
      assert.equal(hex, '7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.intToHex(INT256_MIN);
      assert.equal(hex, '8000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.intToHex(new BN(INT256_MAX));
      assert.equal(hex, '7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.intToHex(new BN(INT256_MIN));
      assert.equal(hex, '8000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.intToHex(new BigNumber(INT256_MAX));
      assert.equal(hex, '7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.intToHex(new BigNumber(INT256_MIN));
      assert.equal(hex, '8000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, PADDED_BYTES);
    });

    it('throws if num is undefined', () => {
      assert.throws(() => Encoder.intToHex(undefined), Error);
      assert.throws(() => Encoder.intToHex(), Error);
    });
  });

  describe('uintToHex()', () => {
    it('should convert uint to hex', () => {
      let hex = Encoder.uintToHex(0);
      assert.equal(hex, '0000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.uintToHex(66100);
      assert.equal(hex, '0000000000000000000000000000000000000000000000000000000000010234');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.uintToHex(1234567890);
      assert.equal(hex, '00000000000000000000000000000000000000000000000000000000499602d2');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.uintToHex('12345678901234567890');
      assert.equal(hex, '000000000000000000000000000000000000000000000000ab54a98ceb1f0ad2');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.uintToHex(0x2386f26fc10000);
      assert.equal(hex, '000000000000000000000000000000000000000000000000002386f26fc10000');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.uintToHex('0x2386f26fc10000');
      assert.equal(hex, '000000000000000000000000000000000000000000000000002386f26fc10000');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.uintToHex('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
      assert.equal(hex, 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.uintToHex(new BN(UINT256_MAX));
      assert.equal(hex, 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.uintToHex(new BN(UINT256_MIN));
      assert.equal(hex, '0000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.uintToHex(new BigNumber(UINT256_MAX));
      assert.equal(hex, 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
      assert.equal(hex.length, PADDED_BYTES);

      hex = Encoder.uintToHex(new BigNumber(UINT256_MIN));
      assert.equal(hex, '0000000000000000000000000000000000000000000000000000000000000000');
      assert.equal(hex.length, PADDED_BYTES);
    });

    it('throws if num is undefined', () => {
      assert.throws(() => Encoder.uintToHex(undefined), Error);
      assert.throws(() => Encoder.uintToHex(), Error);
    });
  });

  describe('padHexString()', () => {
    it('should pad an existing hex string', () => {
      let paddedStr = Encoder.padHexString('5f5e100');
      assert.equal(paddedStr, '0000000000000000000000000000000000000000000000000000000005f5e100');
      assert.equal(paddedStr.length, PADDED_BYTES);

      paddedStr = Encoder.padHexString('0x5f5e100');
      assert.equal(paddedStr, '0000000000000000000000000000000000000000000000000000000005f5e100');
      assert.equal(paddedStr.length, PADDED_BYTES);
    });

    it('throws if hexStr is undefined', () => {
      assert.throws(() => Encoder.padHexString(), Error);
      assert.throws(() => Encoder.padHexString(undefined), Error);
    });

    it('throws if hexStr is not hex', () => {
      assert.throws(() => Encoder.padHexString('hello world'), Error);
    });
  });

  describe('validateMethodAndArgs()', () => {
    const { abi } = ContractMetadata.EventFactory;
    const args = ['qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy', 'Hello World', ['a', 'b', 'c'], 'c350', 'c738'];

    it('validates the methodName and methodArgs', () => {
      assert.isTrue(Encoder.validateMethodAndArgs(abi, 'createTopic', args));
    });

    it('throws if abi is undefined', () => {
      assert.throws(() => Encoder.validateMethodAndArgs(undefined, 'vote', args), Error);
    });

    it('throws if methodName is undefined', () => {
      assert.throws(() => Encoder.validateMethodAndArgs(abi, undefined, args), Error);
    });

    it('throws if methodName is not found in ABI', () => {
      assert.throws(() => Encoder.validateMethodAndArgs(abi, 'vote', args), Error);
    });

    it('throws if methodArgs does not match args in ABI', () => {
      assert.throws(() => Encoder.validateMethodAndArgs(abi, 'createTopic', ['qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy', 'Hello World',
        ['a', 'b', 'c'], 'c350']), Error);
    });
  });

  describe('constructDataHex()', () => {
    const { abi } = ContractMetadata.EventFactory;

    it('constructs the datahex', () => {
      const args = ['qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy', 'Hello World', ['a', 'b', 'c'], '0xc350', '0xc738'];
      const dataHex = Encoder.constructData(abi, 'createTopic', args);

      const funcHash = 'd0613dce';
      const oracle = '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3';
      const name = '48656c6c6f20576f726c64000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      const resultNames = '6100000000000000000000000000000000000000000000000000000000000000620000000000000000000000000000000000000000000000000000000000000063000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      const bettingEndBlock = '000000000000000000000000000000000000000000000000000000000000C350';
      const resultSettingEndBlock = '000000000000000000000000000000000000000000000000000000000000C738';

      assert.equal(
        dataHex,
        funcHash.concat(oracle)
          .concat(name)
          .concat(resultNames)
          .concat(bettingEndBlock)
          .concat(resultSettingEndBlock)
          .toLowerCase(),
      );
    });

    it('constructs the datahex for many different types', () => {
      const methodObj = {
        constant: true,
        inputs: [
          {
            name: '_first',
            type: 'uint256',
          },
          {
            name: '_second',
            type: 'uint256[]',
          },
          {
            name: '_third',
            type: 'bool',
          },
          {
            name: '_fourth',
            type: 'uint256[3]',
          },
          {
            name: '_fifth',
            type: 'address[]',
          },
        ],
        name: 'test',
        outputs: [

        ],
        payable: false,
        stateMutability: 'pure',
        type: 'function',
      };
      const args = [
        1234567890,
        ['49837717385', 1234567890, '0x87A23'],
        true,
        ['49837717385', 1234567890, '0x87A23'],
        ['qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy', 'qKoxAUEQ1Nj6anwes6ZjRGQ7aqdiyUeat8'],
      ];
      const dataHex = Encoder.constructData([methodObj], 'test', args);

      const funcHash = Encoder.objToHash(methodObj, true);

      const first = '00000000000000000000000000000000000000000000000000000000499602D2';
      const second = '00000000000000000000000000000000000000000000000000000000000000E0';
      const third = '0000000000000000000000000000000000000000000000000000000000000001';
      const fourth = '0000000000000000000000000000000000000000000000000000000B9A8F378900000000000000000000000000000000000000000000000000000000499602D20000000000000000000000000000000000000000000000000000000000087A23';
      const fifth = '0000000000000000000000000000000000000000000000000000000000000160';

      const secondData = '00000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000B9A8F378900000000000000000000000000000000000000000000000000000000499602D20000000000000000000000000000000000000000000000000000000000087A23';
      const fifthData = '000000000000000000000000000000000000000000000000000000000000000200000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa300000000000000000000000018b1a0dc71e4de23c20dc4163f9696d2d9d63868';

      assert.equal(
        dataHex,
        funcHash
          .concat(first)
          .concat(second)
          .concat(third)
          .concat(fourth)
          .concat(fifth)
          .concat(secondData)
          .concat(fifthData)
          .toLowerCase(),
      );
    });

    it('converts address types', () => {
      const methodObj = {
        constant: true,
        inputs: [
          {
            name: '',
            type: 'address',
          },
        ],
        name: 'testMethod',
        outputs: [],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      };
      const args = ['qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy'];
      const dataHex = Encoder.constructData([methodObj], 'testMethod', args);

      const funcHash = Encoder.objToHash(methodObj, true);
      const param = '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3';
      assert.equal(dataHex, funcHash.concat(param));
    });

    it('converts fixed array address types', () => {
      const methodObj = {
        constant: true,
        inputs: [
          {
            name: '',
            type: 'address[2]',
          },
        ],
        name: 'testMethod',
        outputs: [],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      };
      const args = [['qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy', 'qKoxAUEQ1Nj6anwes6ZjRGQ7aqdiyUeat8']];
      const dataHex = Encoder.constructData([methodObj], 'testMethod', args);

      const funcHash = Encoder.objToHash(methodObj, true);
      const param1 = '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3';
      const param2 = '00000000000000000000000018b1a0dc71e4de23c20dc4163f9696d2d9d63868';
      assert.equal(dataHex, funcHash.concat(param1).concat(param2));
    });

    it('converts dynamic array address types', () => {
      const methodObj = {
        constant: true,
        inputs: [
          {
            name: '_addresses',
            type: 'address[]',
          },
        ],
        name: 'test',
        outputs: [],
        payable: false,
        stateMutability: 'pure',
        type: 'function',
      };

      const args = [['qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy', 'qKoxAUEQ1Nj6anwes6ZjRGQ7aqdiyUeat8']];
      const dataHex = Encoder.constructData([methodObj], 'test', args);

      const funcHash = Encoder.objToHash(methodObj, true);
      const dataLoc = '0000000000000000000000000000000000000000000000000000000000000020';
      const dataLen = '0000000000000000000000000000000000000000000000000000000000000002';
      const param1 = '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3';
      const param2 = '00000000000000000000000018b1a0dc71e4de23c20dc4163f9696d2d9d63868';
      assert.equal(dataHex, funcHash.concat(dataLoc).concat(dataLen).concat(param1).concat(param2));
    });

    it('converts bool types', () => {
      const methodObj = {
        constant: true,
        inputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        name: 'didWithdraw',
        outputs: [],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      };
      const args = [true];
      const dataHex = Encoder.constructData([methodObj], 'didWithdraw', args);

      const funcHash = Encoder.objToHash(methodObj, true);
      const param = '0000000000000000000000000000000000000000000000000000000000000001';
      assert.equal(dataHex, funcHash.concat(param));
    });

    it('converts fixed array bool types', () => {
      const methodObj = {
        constant: true,
        inputs: [
          {
            name: '_booleans',
            type: 'bool[2]',
          },
        ],
        name: 'test',
        outputs: [],
        payable: false,
        stateMutability: 'pure',
        type: 'function',
      };

      const args = [[true, false]];
      const dataHex = Encoder.constructData([methodObj], 'test', args);

      const funcHash = Encoder.objToHash(methodObj, true);
      const param1 = '0000000000000000000000000000000000000000000000000000000000000001';
      const param2 = '0000000000000000000000000000000000000000000000000000000000000000';
      assert.equal(dataHex, funcHash.concat(param1).concat(param2));
    });

    it('converts dynamic array bool types', () => {
      const methodObj = {
        constant: true,
        inputs: [
          {
            name: '_booleans',
            type: 'bool[]',
          },
        ],
        name: 'test',
        outputs: [],
        payable: false,
        stateMutability: 'pure',
        type: 'function',
      };

      const args = [[true, false, true]];
      const dataHex = Encoder.constructData([methodObj], 'test', args);

      const funcHash = Encoder.objToHash(methodObj, true);
      const dataLoc = '0000000000000000000000000000000000000000000000000000000000000020';
      const dataLen = '0000000000000000000000000000000000000000000000000000000000000003';
      const param1 = '0000000000000000000000000000000000000000000000000000000000000001';
      const param2 = '0000000000000000000000000000000000000000000000000000000000000000';
      const param3 = '0000000000000000000000000000000000000000000000000000000000000001';
      assert.equal(dataHex, funcHash.concat(dataLoc).concat(dataLen).concat(param1).concat(param2)
        .concat(param3));
    });

    it('converts uint types', () => {
      const methodObj = {
        constant: true,
        inputs: [
          {
            name: '',
            type: 'uint32',
          },
        ],
        name: 'didWithdraw',
        outputs: [],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      };
      const args = [2147483647]; // max uint32
      const dataHex = Encoder.constructData([methodObj], 'didWithdraw', args);

      const funcHash = Encoder.objToHash(methodObj, true);
      const param = '000000000000000000000000000000000000000000000000000000007FFFFFFF'.toLowerCase();
      assert.equal(dataHex, funcHash.concat(param));
    });

    it('converts fixed array uint types', () => {
      const methodObj = {
        constant: true,
        inputs: [
          {
            name: '_uints',
            type: 'uint256[3]',
          },
        ],
        name: 'test',
        outputs: [],
        payable: false,
        stateMutability: 'pure',
        type: 'function',
      };

      const args = [['49837717385', 1234567890, '0x87A23']];
      const dataHex = Encoder.constructData([methodObj], 'test', args);

      const funcHash = Encoder.objToHash(methodObj, true);
      const param1 = '0000000000000000000000000000000000000000000000000000000B9A8F3789';
      const param2 = '00000000000000000000000000000000000000000000000000000000499602D2';
      const param3 = '0000000000000000000000000000000000000000000000000000000000087A23';
      assert.equal(dataHex, funcHash.concat(param1).concat(param2).concat(param3).toLowerCase());
    });

    it('converts dynamic array uint types', () => {
      const methodObj = {
        constant: true,
        inputs: [
          {
            name: '_uints',
            type: 'uint256[]',
          },
        ],
        name: 'test',
        outputs: [],
        payable: false,
        stateMutability: 'pure',
        type: 'function',
      };

      const args = [['49837717385', 1234567890, '0x87A23']];
      const dataHex = Encoder.constructData([methodObj], 'test', args);

      const funcHash = Encoder.objToHash(methodObj, true);
      const dataLoc = '0000000000000000000000000000000000000000000000000000000000000020';
      const dataLen = '0000000000000000000000000000000000000000000000000000000000000003';
      const param1 = '0000000000000000000000000000000000000000000000000000000B9A8F3789';
      const param2 = '00000000000000000000000000000000000000000000000000000000499602D2';
      const param3 = '0000000000000000000000000000000000000000000000000000000000087A23';
      assert.equal(dataHex, funcHash.concat(dataLoc).concat(dataLen).concat(param1).concat(param2)
        .concat(param3)
        .toLowerCase());
    });

    it('converts int types', () => {
      const methodObj = {
        constant: true,
        inputs: [
          {
            name: '',
            type: 'int32',
          },
        ],
        name: 'test',
        outputs: [],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      };
      const args = [-12345];
      const dataHex = Encoder.constructData([methodObj], 'test', args);

      const funcHash = Encoder.objToHash(methodObj, true);
      const param = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffcfc7';
      assert.equal(dataHex, funcHash.concat(param).toLowerCase());
    });

    it('converts fixed array int types', () => {
      const methodObj = {
        constant: true,
        inputs: [
          {
            name: '_ints',
            type: 'int256[2]',
          },
        ],
        name: 'test',
        outputs: [],
        payable: false,
        stateMutability: 'pure',
        type: 'function',
      };

      const args = [[12345, -12345]];
      const dataHex = Encoder.constructData([methodObj], 'test', args);

      const funcHash = Encoder.objToHash(methodObj, true);
      const param1 = '0000000000000000000000000000000000000000000000000000000000003039';
      const param2 = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffcfc7';
      assert.equal(dataHex, funcHash.concat(param1).concat(param2).toLowerCase());
    });

    it('converts dynamic array int types', () => {
      const methodObj = {
        constant: true,
        inputs: [
          {
            name: '_ints',
            type: 'int256[]',
          },
        ],
        name: 'test',
        outputs: [],
        payable: false,
        stateMutability: 'pure',
        type: 'function',
      };

      const args = [[12345, -12345]];
      const dataHex = Encoder.constructData([methodObj], 'test', args);

      const funcHash = Encoder.objToHash(methodObj, true);
      const dataLoc = '0000000000000000000000000000000000000000000000000000000000000020';
      const dataLen = '0000000000000000000000000000000000000000000000000000000000000002';
      const param1 = '0000000000000000000000000000000000000000000000000000000000003039';
      const param2 = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffcfc7';
      assert.equal(dataHex, funcHash.concat(dataLoc).concat(dataLen).concat(param1).concat(param2)
        .toLowerCase());
    });

    it('converts bytes types', () => {
      let methodObj = {
        constant: true,
        inputs: [
          {
            name: '',
            type: 'bytes32',
          },
        ],
        name: 'didWithdraw',
        outputs: [],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      };
      let args = ['hello'];
      let dataHex = Encoder.constructData([methodObj], 'didWithdraw', args);

      let funcHash = Encoder.objToHash(methodObj, true);
      let param = '68656c6c6f000000000000000000000000000000000000000000000000000000';
      assert.equal(dataHex, funcHash.concat(param));

      methodObj = {
        constant: true,
        inputs: [
          {
            name: '',
            type: 'bytes8',
          },
        ],
        name: 'didWithdraw',
        outputs: [],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      };
      args = ['hello'];
      dataHex = Encoder.constructData([methodObj], 'didWithdraw', args);

      funcHash = Encoder.objToHash(methodObj, true);
      param = '68656c6c6f000000000000000000000000000000000000000000000000000000';
      assert.equal(dataHex, funcHash.concat(param));
    });

    it('converts fixed array bytes types', () => {
      let methodObj = {
        constant: true,
        inputs: [
          {
            name: '',
            type: 'bytes32[10]',
          },
        ],
        name: 'test',
        outputs: [],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      };
      let args = [['a', 'b', 'c']];
      let dataHex = Encoder.constructData([methodObj], 'test', args);

      let funcHash = Encoder.objToHash(methodObj, true);
      let param = '6100000000000000000000000000000000000000000000000000000000000000620000000000000000000000000000000000000000000000000000000000000063000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      assert.equal(dataHex, funcHash.concat(param));

      methodObj = {
        constant: true,
        inputs: [
          {
            name: '',
            type: 'bytes8[10]',
          },
        ],
        name: 'test',
        outputs: [],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      };
      args = [['a', 'b', 'c']];
      dataHex = Encoder.constructData([methodObj], 'test', args);

      funcHash = Encoder.objToHash(methodObj, true);
      param = '6100000000000000000000000000000000000000000000000000000000000000620000000000000000000000000000000000000000000000000000000000000063000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      assert.equal(dataHex, funcHash.concat(param));
    });

    it('does not parse bytes if < 1 or > 32', () => {
      let methodObj = {
        constant: true,
        inputs: [
          {
            name: '',
            type: 'bytes33',
          },
        ],
        name: 'test',
        outputs: [],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      };
      const args = ['hello'];
      let dataHex = Encoder.constructData([methodObj], 'test', args);

      let funcHash = Encoder.objToHash(methodObj, true);
      assert.equal(dataHex, funcHash);

      methodObj = {
        constant: true,
        inputs: [
          {
            name: '',
            type: 'bytes0',
          },
        ],
        name: 'test',
        outputs: [],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      };
      dataHex = Encoder.constructData([methodObj], 'test', args);

      funcHash = Encoder.objToHash(methodObj, true);
      assert.equal(dataHex, funcHash);
    });

    it('throws if abi is undefined', () => {
      assert.throws(() => Encoder.constructData(undefined, 'test', ['qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy', 'Hello World',
        ['a', 'b', 'c'], 'c350', 'c738']), Error);
    });

    it('throws if methodName is undefined', () => {
      assert.throws(() => Encoder.constructData(abi, undefined, ['qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy', 'Hello World',
        ['a', 'b', 'c'], 'c350', 'c738']), Error);
    });
  });
});
/* eslint-enable no-underscore-dangle, max-len */
