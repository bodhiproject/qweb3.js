import 'babel-polyfill';
import { assert } from 'chai';

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
  });
});
