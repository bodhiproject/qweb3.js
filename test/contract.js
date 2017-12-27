import 'babel-polyfill';
import { assert } from 'chai';
const _ = require('lodash');

import Config from './config/config';
import ContractMetadata from './data/contract_metadata';
import Qweb3 from '../src/qweb3';

describe('Contract', function() {
  let qweb3;
  let contract;

  beforeEach(function() {
    qweb3 = new Qweb3(Config.QTUM_RPC_ADDRESS);
  });

  describe('constructor', function() {
    it('inits all the values', async function() {
      contract = new qweb3.Contract(ContractMetadata.EventFactory.address, ContractMetadata.EventFactory.abi);
      assert.equal(contract.parent, qweb3);
      assert.equal(contract.address, ContractMetadata.EventFactory.address);
      assert.equal(contract.abi, ContractMetadata.EventFactory.abi);
    });

    it('removes the hex prefix from the address', async function() {
      contract = new qweb3.Contract('0x1234567890', ContractMetadata.EventFactory.abi);
      assert.equal(contract.address, '1234567890');
    });
  });

  describe('call()', function() {
    it('returns the values', async function() {
      contract = new qweb3.Contract('dacd16bde8ff9f7689cb8d3363324c77fbb80950', ContractMetadata.TopicEvent.abi);
      
      var res = await contract.call('getEventName', { 
        methodArgs: [], 
        senderAddress: Config.SENDER_ADDRESS 
      });
      assert.equal(res[0].replace(/\0/g, ''), 'Who will win the 2018 NBA Finals Championships?');
    });
  });

  describe('send()', function() {
    it('sends a transaction', async function() {
      contract = new qweb3.Contract('dacd16bde8ff9f7689cb8d3363324c77fbb80950', ContractMetadata.TopicEvent.abi);

      const res = await contract.send('withdrawWinnings', {
        methodArgs: [],
        senderAddress: Config.SENDER_ADDRESS,
      });
      assert.isDefined(res.txid);
      assert.isDefined(res.sender);
      assert.isDefined(res.hash160);
    });
  });

  describe('constructDataHex()', function() {
    beforeEach(function() {
      contract = new qweb3.Contract(ContractMetadata.EventFactory.address, ContractMetadata.EventFactory.abi);
    });

    it('constructs the datahex', async function() {
      const methodObj = _.find(contract.abi, { name: 'createTopic' });
      assert.isDefined(methodObj);

      const args = ['qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy', 'Hello World', ['a', 'b', 'c'], 'c350', 'c738'];
      const dataHex = contract.constructDataHex(methodObj, args);

      const funcHash = 'd0613dce';
      const oracle = '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3';
      const name = '48656c6c6f20576f726c64000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      const resultNames = '6100000000000000000000000000000000000000000000000000000000000000620000000000000000000000000000000000000000000000000000000000000063000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      const bettingEndBlock = '000000000000000000000000000000000000000000000000000000000000C350';
      const resultSettingEndBlock = '000000000000000000000000000000000000000000000000000000000000C738';

      assert.equal(dataHex, funcHash.concat(oracle).concat(name).concat(resultNames).concat(bettingEndBlock)
        .concat(resultSettingEndBlock).toLowerCase());
    });

    it('throws if methodObj is undefined', async function() {
      assert.throws(() => contract.constructDataHex(undefined, ['qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy', 'Hello World', 
        ['a', 'b', 'c'], 'c350', 'c738']), Error);
    });
  });
});
