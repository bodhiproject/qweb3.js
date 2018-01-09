import 'babel-polyfill';
import { assert } from 'chai';
import _ from 'lodash';

import Config from './config/config';
import ContractMetadata from './data/contract_metadata';
import Contract from '../src/contract';
import Encoder from '../src/encoder';

describe('Contract', () => {
  let contract;

  describe('constructor', () => {
    it('inits all the values', async () => {
      contract = new Contract(
        Config.QTUM_RPC_ADDRESS, ContractMetadata.EventFactory.address,
        ContractMetadata.EventFactory.abi,
      );
      assert.isDefined(contract.provider);
      assert.equal(contract.address, ContractMetadata.EventFactory.address);
      assert.equal(contract.abi, ContractMetadata.EventFactory.abi);
    });

    it('removes the hex prefix from the address', async () => {
      contract = new Contract(Config.QTUM_RPC_ADDRESS, '0x1234567890', ContractMetadata.EventFactory.abi);
      assert.equal(contract.address, '1234567890');
    });
  });

  describe('call()', () => {
    it('returns the values', async () => {
      contract = new Contract(
        Config.QTUM_RPC_ADDRESS, 'dacd16bde8ff9f7689cb8d3363324c77fbb80950',
        ContractMetadata.TopicEvent.abi,
      );

      const res = await contract.call('getEventName', {
        methodArgs: [],
        senderAddress: Config.SENDER_ADDRESS,
      });
      assert.equal(res[0].replace(/\0/g, ''), 'Who will win the 2018 NBA Finals Championships?');
    });
  });

  describe('send()', () => {
    it('sends a transaction', async () => {
      contract = new Contract(
        Config.QTUM_RPC_ADDRESS, 'dacd16bde8ff9f7689cb8d3363324c77fbb80950',
        ContractMetadata.TopicEvent.abi,
      );

      const res = await contract.send('withdrawWinnings', {
        methodArgs: [],
        senderAddress: Config.SENDER_ADDRESS,
      });
      assert.isDefined(res.txid);
      assert.isDefined(res.sender);
      assert.isDefined(res.hash160);
    });
  });

  describe('constructDataHex()', () => {
    beforeEach(() => {
      contract = new Contract(
        Config.QTUM_RPC_ADDRESS, ContractMetadata.EventFactory.address,
        ContractMetadata.EventFactory.abi,
      );
    });

    it('constructs the datahex', () => {
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
        .concat(resultSettingEndBlock)
        .toLowerCase());
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
      const dataHex = contract.constructDataHex(methodObj, args);

      const funcHash = Encoder.getFunctionHash(methodObj);
      const param = '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3';
      assert.equal(dataHex, funcHash.concat(param));
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
      const dataHex = contract.constructDataHex(methodObj, args);

      const funcHash = Encoder.getFunctionHash(methodObj);
      const param = '0000000000000000000000000000000000000000000000000000000000000001';
      assert.equal(dataHex, funcHash.concat(param));
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
      const dataHex = contract.constructDataHex(methodObj, args);

      const funcHash = Encoder.getFunctionHash(methodObj);
      const param = '000000000000000000000000000000000000000000000000000000007FFFFFFF'.toLowerCase();
      assert.equal(dataHex, funcHash.concat(param));
    });

    it('converts fixed bytes array types', () => {
      let methodObj = {
        constant: true,
        inputs: [
          {
            name: '',
            type: 'bytes32[10]',
          },
        ],
        name: 'didWithdraw',
        outputs: [],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      };
      let args = [['a', 'b', 'c']];
      let dataHex = contract.constructDataHex(methodObj, args);

      let funcHash = Encoder.getFunctionHash(methodObj);
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
        name: 'didWithdraw',
        outputs: [],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      };
      args = [['a', 'b', 'c']];
      dataHex = contract.constructDataHex(methodObj, args);

      funcHash = Encoder.getFunctionHash(methodObj);
      param = '6100000000000000000000000000000000000000000000000000000000000000620000000000000000000000000000000000000000000000000000000000000063000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      assert.equal(dataHex, funcHash.concat(param));
    });

    it('converts fixed bytes types', () => {
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
      let dataHex = contract.constructDataHex(methodObj, args);

      let funcHash = Encoder.getFunctionHash(methodObj);
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
      dataHex = contract.constructDataHex(methodObj, args);

      funcHash = Encoder.getFunctionHash(methodObj);
      param = '68656c6c6f000000000000000000000000000000000000000000000000000000';
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
        name: 'didWithdraw',
        outputs: [],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      };
      const args = ['hello'];
      let dataHex = contract.constructDataHex(methodObj, args);

      let funcHash = Encoder.getFunctionHash(methodObj);
      assert.equal(dataHex, funcHash);

      methodObj = {
        constant: true,
        inputs: [
          {
            name: '',
            type: 'bytes0',
          },
        ],
        name: 'didWithdraw',
        outputs: [],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      };
      dataHex = contract.constructDataHex(methodObj, args);

      funcHash = Encoder.getFunctionHash(methodObj);
      assert.equal(dataHex, funcHash);
    });

    it('throws if methodObj is undefined', () => {
      assert.throws(() => contract.constructDataHex(undefined, ['qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy', 'Hello World',
        ['a', 'b', 'c'], 'c350', 'c738']), Error);
    });
  });

  describe('validateMethodAndArgs()', () => {
    const args = ['qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy', 'Hello World', ['a', 'b', 'c'], 'c350', 'c738'];

    beforeEach(() => {
      contract = new Contract(
        Config.QTUM_RPC_ADDRESS, ContractMetadata.EventFactory.address,
        ContractMetadata.EventFactory.abi,
      );
    });

    it('validates the methods and returns the methodObj and args', () => {
      const methodAndArgs = contract.validateMethodAndArgs('createTopic', args);
      const methodObj = _.find(contract.abi, { name: 'createTopic' });
      assert.equal(methodAndArgs.method, methodObj);
      assert.equal(methodAndArgs.args, args);
    });

    it('throws if methodName is not found in ABI', () => {
      assert.throws(() => contract.validateMethodAndArgs('vote', args), Error);
    });

    it('throws if methodArgs does not match args in ABI', () => {
      assert.throws(() => contract.validateMethodAndArgs('createTopic', ['qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy', 'Hello World',
        ['a', 'b', 'c'], 'c350']), Error);
    });
  });
});
