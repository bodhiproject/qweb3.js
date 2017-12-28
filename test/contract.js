import 'babel-polyfill';
import { assert } from 'chai';
import _ from 'lodash';

import Config from './config/config';
import ContractMetadata from './data/contract_metadata';
import Contract from '../src/contract';

describe('Contract', function() {
  let contract;

  describe('constructor', function() {
    it('inits all the values', async function() {
      contract = new Contract(Config.QTUM_RPC_ADDRESS, ContractMetadata.EventFactory.address, 
        ContractMetadata.EventFactory.abi);
      assert.isDefined(contract.provider);
      assert.equal(contract.address, ContractMetadata.EventFactory.address);
      assert.equal(contract.abi, ContractMetadata.EventFactory.abi);
    });

    it('removes the hex prefix from the address', async function() {
      contract = new Contract(Config.QTUM_RPC_ADDRESS, '0x1234567890', ContractMetadata.EventFactory.abi);
      assert.equal(contract.address, '1234567890');
    });
  });

  describe('call()', function() {
    it('returns the values', async function() {
      contract = new Contract(Config.QTUM_RPC_ADDRESS, 'dacd16bde8ff9f7689cb8d3363324c77fbb80950', 
        ContractMetadata.TopicEvent.abi);
      
      var res = await contract.call('getEventName', { 
        methodArgs: [], 
        senderAddress: Config.SENDER_ADDRESS 
      });
      assert.equal(res[0].replace(/\0/g, ''), 'Who will win the 2018 NBA Finals Championships?');
    });
  });

  describe('send()', function() {
    it('sends a transaction', async function() {
      contract = new Contract(Config.QTUM_RPC_ADDRESS, 'dacd16bde8ff9f7689cb8d3363324c77fbb80950', 
        ContractMetadata.TopicEvent.abi);

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
      contract = new Contract(Config.QTUM_RPC_ADDRESS, ContractMetadata.EventFactory.address, 
        ContractMetadata.EventFactory.abi);
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

  describe('validateMethodAndArgs()', function() {
    const args = ['qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy', 'Hello World', ['a', 'b', 'c'], 'c350', 'c738'];

    beforeEach(function() {
      contract = new Contract(Config.QTUM_RPC_ADDRESS, ContractMetadata.EventFactory.address, 
        ContractMetadata.EventFactory.abi);
    });

    it('validates the methods and returns the methodObj and args', async function() {
      const methodAndArgs = contract.validateMethodAndArgs('createTopic', args);
      const methodObj = _.find(contract.abi, { name: 'createTopic' });
      assert.equal(methodAndArgs.method, methodObj);
      assert.equal(methodAndArgs.args, args);
    });

    it('throws if methodName is not found in ABI', async function() {
      assert.throws(() => contract.validateMethodAndArgs('vote', args), Error);
    });

    it('throws if methodArgs does not match args in ABI', async function() {
      assert.throws(() => contract.validateMethodAndArgs('createTopic', ['qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy', 'Hello World', 
        ['a', 'b', 'c'], 'c350']), Error);
    });
  });
});
