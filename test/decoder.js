const chai = require('chai');

const ContractMetadata = require('./data/contract_metadata');
const Decoder = require('../src/decoder');

const { assert, expect } = chai;

describe('Decoder', () => {
  describe('toQtumAddress()', () => {
    it('returns the converted qtum address', () => {
      assert.equal(
        Decoder.toQtumAddress('17e7888aa7412a735f336d2f6d784caefabb6fa3', false),
        'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
      );
      assert.equal(
        Decoder.toQtumAddress('2a2ad24849bc061f0f7abee243ebdb584b0d11f1', true),
        'QQSwne4oB1jmRXceHrs9tPGQmn7qjvSqyR',
      );
    });

    it('throws if hexAddress is undefined or empty', () => {
      expect(() => Decoder.toQtumAddress()).to.throw();
      expect(() => Decoder.toQtumAddress('')).to.throw();
    });

    it('throws if hexAddress is not hex', () => {
      expect(() => Decoder.toQtumAddress('qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy')).to.throw();
    });
  });

  describe('removeHexPrefix()', () => {
    it('returns the value without the hex prefix', () => {
      const hexValue = '0x1111111111111111111111111111111111111111';
      assert.equal(Decoder.removeHexPrefix(hexValue), hexValue.slice(2));
    });

    it('returns the array values with hex prefixes', () => {
      const hexArray = ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'];
      const expected = [hexArray[0].slice(2), hexArray[1].slice(2)];
      assert.deepEqual(Decoder.removeHexPrefix(hexArray), expected);
    });
  });

  describe('decodeCall()', () => {
    const rawOutput = {
      address: 'a6dd0b0399dc6162cedde85ed50c6fa4a0dd44f1',
      executionResult: {
        gasUsed: 21720,
        excepted: 'None',
        newAddress: 'a6dd0b0399dc6162cedde85ed50c6fa4a0dd44f1',
        output: '000000000000000000000000000000000000000000000000002386f26fc10000',
        codeDeposit: 0,
        gasRefunded: 0,
        depositSize: 0,
        gasForDeposit: 0,
      },
      transactionReceipt: {
        stateRoot: 'e6dfdcb1a7b722f39cf036d681ff76637f556447a8dea0d29f05b83df82d9cc0',
        gasUsed: 21720,
        bloom: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', // eslint-disable-line
        log: [],
      },
    };

    it('returns the formattedOutput in the object', () => {
      const decoded = Decoder.decodeCall(rawOutput, ContractMetadata.BodhiToken.abi, 'tokenTotalSupply');
      assert.isDefined(decoded.executionResult.formattedOutput);
    });

    it('throws if rawOutput, contractABI, or methodName is undefined', () => {
      expect(() => Decoder.decodeCall(undefined, ContractMetadata.BodhiToken.abi, 'tokenTotalSupply')).to.throw();
      expect(() => Decoder.decodeCall(rawOutput, undefined, 'tokenTotalSupply')).to.throw();
      expect(() => Decoder.decodeCall(rawOutput, ContractMetadata.BodhiToken.abi, undefined)).to.throw();
    });
  });
});
