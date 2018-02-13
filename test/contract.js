const _ = require('lodash');
const Web3Utils = require('web3-utils');
const BN = require('bn.js');
const chai = require('chai');
const assert = chai.assert;

const Config = require('./config/config');
const ContractMetadata = require('./data/contract_metadata');
const Contract = require('../src/contract');
const Encoder = require('../src/encoder');
const Formatter = require('../src/formatter');

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
      // getVoteBalances() result
      const result = {
        address: '09223575cc86e0c7d42f3b16f20fceb2caef828b',
        executionResult: {
          gasUsed: 26859,
          excepted: 'None',
          newAddress: '09223575cc86e0c7d42f3b16f20fceb2caef828b',
          output: '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002540be40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
          codeDeposit: 0,
          gasRefunded: 0,
          depositSize: 0,
          gasForDeposit: 0,
        },
        transactionReceipt: {
          stateRoot: 'b1121cfe67b3c73e95e9aa8d8e7a95ecff7395f225016b07a862d8fdc6938aef',
          gasUsed: 26859,
          bloom: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
          log: [
          ],
        },
      };

      const formatted = Formatter.callOutput(result, ContractMetadata.DecentralizedOracle.abi, 'getVoteBalances', true);
      assert.isDefined(formatted[0]);
      assert.isTrue(_.every(formatted[0], item => Web3Utils.isBN(item)));
      assert.equal(formatted[0][2].toString(16), new BN('10000000000').toString(16));
    });
  });

  describe('send()', () => {
    it('sends a transaction', async () => {
      const res = {
        txid: '685f23b364242e4954a2a62a42c3632762d19f37e24c34edc495cc0e117a9112',
        sender: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
        hash160: '17e7888aa7412a735f336d2f6d784caefabb6fa3',
      };

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

      const args = ['qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy', 'Hello World', ['a', 'b', 'c'], '0xc350', '0xc738'];
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

    it('constructs the datahex for many different types', () => {
      const methodObj = {
        "constant": true,
        "inputs": [
          {
            "name": "_first",
            "type": "uint256"
          },
          {
            "name": "_second",
            "type": "uint256[]"
          },
          {
            "name": "_third",
            "type": "bool"
          },
          {
            "name": "_fourth",
            "type": "uint256[3]"
          },
          {
            "name": "_fifth",
            "type": "address[]"
          }
        ],
        "name": "test",
        "outputs": [
          
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      };

      const args = [
        1234567890,
        ['49837717385', 1234567890, '0x87A23'],
        true,
        ['49837717385', 1234567890, '0x87A23'],
        ['qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy', 'qKoxAUEQ1Nj6anwes6ZjRGQ7aqdiyUeat8'],
      ];
      const dataHex = contract.constructDataHex(methodObj, args);

      const funcHash = Encoder.objToHash(methodObj, true);

      const first = '00000000000000000000000000000000000000000000000000000000499602D2';
      const second = '00000000000000000000000000000000000000000000000000000000000000E0';
      const third = '0000000000000000000000000000000000000000000000000000000000000001';
      const fourth = '0000000000000000000000000000000000000000000000000000000B9A8F378900000000000000000000000000000000000000000000000000000000499602D20000000000000000000000000000000000000000000000000000000000087A23';
      const fifth = '0000000000000000000000000000000000000000000000000000000000000160';

      const secondData = '00000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000B9A8F378900000000000000000000000000000000000000000000000000000000499602D20000000000000000000000000000000000000000000000000000000000087A23';
      const fifthData = '000000000000000000000000000000000000000000000000000000000000000200000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa300000000000000000000000018b1a0dc71e4de23c20dc4163f9696d2d9d63868';

      assert.equal(dataHex, funcHash.concat(first).concat(second).concat(third).concat(fourth).concat(fifth)
        .concat(secondData).concat(fifthData).toLowerCase());
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

      const funcHash = Encoder.objToHash(methodObj, true);
      const param = '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3';
      assert.equal(dataHex, funcHash.concat(param));
    });

    it('converts fixed array address types', () => {
      let methodObj = {
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
      let args = [['qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy', 'qKoxAUEQ1Nj6anwes6ZjRGQ7aqdiyUeat8']];
      let dataHex = contract.constructDataHex(methodObj, args);

      const funcHash = Encoder.objToHash(methodObj, true);
      const param1 = '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3';
      const param2 = '00000000000000000000000018b1a0dc71e4de23c20dc4163f9696d2d9d63868';
      assert.equal(dataHex, funcHash.concat(param1).concat(param2));
    });

    it('converts dynamic array address types', () => {
      let methodObj = {
        "constant": true,
        "inputs": [
          {
            "name": "_addresses",
            "type": "address[]"
          }
        ],
        "name": "test",
        "outputs": [],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      };

      const args = [['qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy', 'qKoxAUEQ1Nj6anwes6ZjRGQ7aqdiyUeat8']];
      const dataHex = contract.constructDataHex(methodObj, args);

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
      const dataHex = contract.constructDataHex(methodObj, args);

      const funcHash = Encoder.objToHash(methodObj, true);
      const param = '0000000000000000000000000000000000000000000000000000000000000001';
      assert.equal(dataHex, funcHash.concat(param));
    });

    it('converts fixed array bool types', () => {
      let methodObj = {
        "constant": true,
        "inputs": [
          {
            "name": "_booleans",
            "type": "bool[2]"
          }
        ],
        "name": "test",
        "outputs": [],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      };

      const args = [[true, false]];
      const dataHex = contract.constructDataHex(methodObj, args);

      const funcHash = Encoder.objToHash(methodObj, true);
      const param1 = '0000000000000000000000000000000000000000000000000000000000000001';
      const param2 = '0000000000000000000000000000000000000000000000000000000000000000';
      assert.equal(dataHex, funcHash.concat(param1).concat(param2));
    });

    it('converts dynamic array bool types', () => {
      let methodObj = {
        "constant": true,
        "inputs": [
          {
            "name": "_booleans",
            "type": "bool[]"
          }
        ],
        "name": "test",
        "outputs": [],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      };

      const args = [[true, false, true]];
      const dataHex = contract.constructDataHex(methodObj, args);

      const funcHash = Encoder.objToHash(methodObj, true);
      const dataLoc = '0000000000000000000000000000000000000000000000000000000000000020';
      const dataLen = '0000000000000000000000000000000000000000000000000000000000000003';
      const param1 = '0000000000000000000000000000000000000000000000000000000000000001';
      const param2 = '0000000000000000000000000000000000000000000000000000000000000000';
      const param3 = '0000000000000000000000000000000000000000000000000000000000000001';
      assert.equal(dataHex, funcHash.concat(dataLoc).concat(dataLen).concat(param1).concat(param2).concat(param3));
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

      const funcHash = Encoder.objToHash(methodObj, true);
      const param = '000000000000000000000000000000000000000000000000000000007FFFFFFF'.toLowerCase();
      assert.equal(dataHex, funcHash.concat(param));
    });

    it('converts fixed array uint types', () => {
      let methodObj = {
        "constant": true,
        "inputs": [
          {
            "name": "_uints",
            "type": "uint256[3]"
          }
        ],
        "name": "test",
        "outputs": [],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      };

      const args = [['49837717385', 1234567890, '0x87A23']];
      const dataHex = contract.constructDataHex(methodObj, args);

      const funcHash = Encoder.objToHash(methodObj, true);
      const param1 = '0000000000000000000000000000000000000000000000000000000B9A8F3789';
      const param2 = '00000000000000000000000000000000000000000000000000000000499602D2';
      const param3 = '0000000000000000000000000000000000000000000000000000000000087A23';
      assert.equal(dataHex, funcHash.concat(param1).concat(param2).concat(param3).toLowerCase());
    });

    it('converts dynamic array uint types', () => {
      let methodObj = {
        "constant": true,
        "inputs": [
          {
            "name": "_uints",
            "type": "uint256[]"
          }
        ],
        "name": "test",
        "outputs": [],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      };

      const args = [['49837717385', 1234567890, '0x87A23']];
      const dataHex = contract.constructDataHex(methodObj, args);

      const funcHash = Encoder.objToHash(methodObj, true);
      const dataLoc = '0000000000000000000000000000000000000000000000000000000000000020';
      const dataLen = '0000000000000000000000000000000000000000000000000000000000000003';
      const param1 = '0000000000000000000000000000000000000000000000000000000B9A8F3789';
      const param2 = '00000000000000000000000000000000000000000000000000000000499602D2';
      const param3 = '0000000000000000000000000000000000000000000000000000000000087A23';
      assert.equal(dataHex, funcHash.concat(dataLoc).concat(dataLen).concat(param1).concat(param2).concat(param3)
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
      const dataHex = contract.constructDataHex(methodObj, args);

      const funcHash = Encoder.objToHash(methodObj, true);
      const param = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffcfc7';
      assert.equal(dataHex, funcHash.concat(param).toLowerCase());
    });

    it('converts fixed array int types', () => {
      let methodObj = {
        "constant": true,
        "inputs": [
          {
            "name": "_ints",
            "type": "int256[2]"
          }
        ],
        "name": "test",
        "outputs": [],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      };

      const args = [[12345, -12345]];
      const dataHex = contract.constructDataHex(methodObj, args);

      const funcHash = Encoder.objToHash(methodObj, true);
      const param1 = '0000000000000000000000000000000000000000000000000000000000003039';
      const param2 = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffcfc7';
      assert.equal(dataHex, funcHash.concat(param1).concat(param2).toLowerCase());
    });

    it('converts dynamic array int types', () => {
      let methodObj = {
        "constant": true,
        "inputs": [
          {
            "name": "_ints",
            "type": "int256[]"
          }
        ],
        "name": "test",
        "outputs": [],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      };

      const args = [[12345, -12345]];
      const dataHex = contract.constructDataHex(methodObj, args);

      const funcHash = Encoder.objToHash(methodObj, true);
      const dataLoc = '0000000000000000000000000000000000000000000000000000000000000020';
      const dataLen = '0000000000000000000000000000000000000000000000000000000000000002';
      const param1 = '0000000000000000000000000000000000000000000000000000000000003039';
      const param2 = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffcfc7';
      assert.equal(dataHex, funcHash.concat(dataLoc).concat(dataLen).concat(param1).concat(param2).toLowerCase());
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
      let dataHex = contract.constructDataHex(methodObj, args);

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
      dataHex = contract.constructDataHex(methodObj, args);

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
        name: 'didWithdraw',
        outputs: [],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      };
      let args = [['a', 'b', 'c']];
      let dataHex = contract.constructDataHex(methodObj, args);

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
        name: 'didWithdraw',
        outputs: [],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      };
      args = [['a', 'b', 'c']];
      dataHex = contract.constructDataHex(methodObj, args);

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
        name: 'didWithdraw',
        outputs: [],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      };
      const args = ['hello'];
      let dataHex = contract.constructDataHex(methodObj, args);

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
        name: 'didWithdraw',
        outputs: [],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      };
      dataHex = contract.constructDataHex(methodObj, args);

      funcHash = Encoder.objToHash(methodObj, true);
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
