import 'babel-polyfill';
import { assert } from 'chai';
const utf8 = require('utf8');

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
});
