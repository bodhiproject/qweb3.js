/* global describe,it,beforeEach */
const assert = require('chai').assert;

import Qweb3 from '../src/qweb3';
import Contracts from './data/Contracts';

describe('Contract AddressManager', () => {

  let qweb3;
  let contract;

  beforeEach(() => {

    qweb3 = new Qweb3('http://kezjo:qweASD@localhost:13889');
    contract = new qweb3.Contract(Contracts.AddressManager.address, Contracts.AddressManager.abi);

  });

  describe('methods', () => {

    /** Make sure bodhiTokenAddress returns result */
    it('bodhiTokenAddress', () => {

      return contract.call('bodhiTokenAddress')
        .then((res) => {
          console.log(res);
          assert.isDefined(res.executionResult.output);
        });
    });

    /** Make sure getBodhiTokenAddress returns result */
    it('getBodhiTokenAddress', () => {

      return contract.call('getBodhiTokenAddress')
        .then((res) => {
          console.log(res);
          assert.isDefined(res.executionResult.output);
        });
    });
  });

  /** Make sure setBodhiTokenAddress returns txid */
  it('setBodhiTokenAddress', () => {

    return contract.send('setBodhiTokenAddress', {
        senderAddress: 'qXtCoQkTEpYRWb5puzC6Wfrquc8K9f2sZs',
        data: ['0x5089a838dc9b27174c3b7a0314c6a6219d3002ed'],
      })
      .then((res) => {
        console.log(res);
        assert.isDefined(res.txid);
      });
  });

  /** Make sure getLastOracleFactoryIndex returns result */
  it('getLastOracleFactoryIndex', () => {

    return contract.call('getLastOracleFactoryIndex')
      .then((res) => {
        console.log(res);
        assert.isDefined(res.executionResult.output);
      });
  });

  /** Make sure eventFactoryAddresses returns result */
  it('eventFactoryAddresses', () => {

    return contract.call('eventFactoryAddresses', 0)
      .then((res) => {
        console.log(res);
        assert.isDefined(res.executionResult.output);
        assert.equal(res.executionResult.output, '000000000000000000000000f6464ab9222b959a50765ac5c4889f8c3fe24241');
      });
  });
});