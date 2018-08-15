/* eslint-disable no-underscore-dangle, max-len */
const _ = require('lodash');
const Web3Utils = require('web3-utils');
const BN = require('bn.js');
const chai = require('chai');

const { getQtumRPCAddress } = require('../../test/utils');
const ContractMetadata = require('../../test/data/contract_metadata');
const Contract = require('../contract');
const Decoder = require('../formatters/decoder');

const { assert } = chai;

describe('Contract', () => {
  let contract;

  describe('constructor', () => {
    it('inits all the values', async () => {
      contract = new Contract(
        getQtumRPCAddress(),
        ContractMetadata.EventFactory.address,
        ContractMetadata.EventFactory.abi,
      );
      assert.isDefined(contract.provider);
      assert.equal(contract.address, ContractMetadata.EventFactory.address);
      assert.equal(contract.abi, ContractMetadata.EventFactory.abi);
    });

    it('removes the hex prefix from the address', async () => {
      contract = new Contract(getQtumRPCAddress(), '0x1234567890', ContractMetadata.EventFactory.abi);
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

      const formatted = Decoder.decodeCall(result, ContractMetadata.DecentralizedOracle.abi, 'getVoteBalances', true);
      assert.isDefined(formatted.executionResult.formattedOutput[0]);
      assert.isTrue(_.every(formatted.executionResult.formattedOutput[0], item => Web3Utils.isBN(item)));
      assert.equal(formatted.executionResult.formattedOutput[0][2].toString(16), new BN('10000000000').toString(16));
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

    it('returns the args object with the sent params', async () => {
      const res = {
        txid: '60c14ddc003a84a0947db1ac9cbfb01f1d3253b7948dc95343d7dd5a9d5900e9',
        sender: 'qUNeKdqh269AwJWxDFnxUAqKSJ9deSUsgF',
        hash160: '76a177b79b8ef37437dce27a38fa2653eb6d8241',
        args: {
          contractAddress: 'f6177bc9812eeb531907621af6641a41133dea9e',
          amount: 0,
          gasLimit: 250000,
          gasPrice: 4e-7,
        },
      };

      assert.isString(res.args.contractAddress);
      assert.isNumber(res.args.amount);
      assert.isNumber(res.args.gasLimit);
      assert.isNumber(res.args.gasPrice);
    });
  });
});
/* eslint-enable no-underscore-dangle, max-len */
