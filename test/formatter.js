/* global describe,it,beforeEach */
import { assert } from 'chai';
import _ from 'lodash';
import util from 'util';
import utils from '../src/utils';
import web3 from 'web3';
import Formatter from '../src/formatter';

const CONTRACT_ADDRESS = 'f6464ab9222b959a50765ac5c4889f8c3fe24241';
const CONTRACT_ABI = [{
  constant: true,
  inputs: [{ name: '', type: 'bytes32' }],
  name: 'topics',
  outputs: [{ name: '', type: 'address' }],
  payable: false,
  stateMutability: 'view',
  type: 'function',
}, {
  constant: false,
  inputs: [{ name: '_resultSetter', type: 'address' }, { name: '_name', type: 'bytes' }, { name: '_resultNames', type: 'bytes32[]' }, { name: '_bettingEndBlock', type: 'uint256' }],
  name: 'createTopic',
  outputs: [{ name: 'tokenAddress', type: 'address' }],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function',
}, {
  constant: true,
  inputs: [{ name: '_name', type: 'bytes' }, { name: '_resultNames', type: 'bytes32[]' }, { name: '_bettingEndBlock', type: 'uint256' }],
  name: 'doesTopicExist',
  outputs: [{ name: '', type: 'bool' }],
  payable: false,
  stateMutability: 'view',
  type: 'function',
}, {
  inputs: [{ name: '_addressManager', type: 'address' }],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'constructor',
}, {
  anonymous: false,
  inputs: [{ indexed: true, name: '_creator', type: 'address' }, { indexed: false, name: '_topicEvent', type: 'address' }, { indexed: false, name: '_name', type: 'bytes' }, { indexed: false, name: '_resultNames', type: 'bytes32[]' }, { indexed: false, name: '_bettingEndBlock', type: 'uint256' }],
  name: 'TopicCreated',
  type: 'event',
}];

describe('Formatter', () => {
  describe('methods', () => {

    /** Validate that Formatter.searchLogOutput resturns expected results */
    it('searchLogOutput', (done) => {

      let logs = [{
        "blockHash": "10aa1bf45327d879bdb00db388986098b6a4cbbb6d8d5f823b65dd35968e5015",
        "blockNumber": 31774,
        "transactionHash": "481d49ee544b65e769e71f2ecaa4a2b07133d0e0081abf80efaf9fdfefd59db7",
        "transactionIndex": 2,
        "from": "e34f17c07c3c023095788c7ebb6d5b845608beea",
        "to": "f6464ab9222b959a50765ac5c4889f8c3fe24241",
        "cumulativeGasUsed": 724281,
        "gasUsed": 724281,
        "contractAddress": "f6464ab9222b959a50765ac5c4889f8c3fe24241",
        "log": [{
            "address": "c72a8213cf1b2e832a1c791f4f2843d5c03447a8",
            "topics": [
              "99a22f51dd06fe2274374184655c153b53126acd2028c2d9cda50d7be5dfff0e"
            ],
            "data": "0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000a6669727374546f70696300000000000000000000000000000000000000000000"
          },
          {
            "address": "f6464ab9222b959a50765ac5c4889f8c3fe24241",
            "topics": [
              "382e62114f64d453f3b5c053e57839bdd9a0bfb9d63acd772a7b1572ffdd5df7",
              "000000000000000000000000e34f17c07c3c023095788c7ebb6d5b845608beea"
            ],
            "data": "000000000000000000000000c72a8213cf1b2e832a1c791f4f2843d5c03447a8000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000080e8000000000000000000000000000000000000000000000000000000000000000a6669727374546f706963000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002726573756c743100000000000000000000000000000000000000000000000000726573756c743200000000000000000000000000000000000000000000000000"
          }
        ]
      }];

      let formatted = Formatter.searchLogOutput(logs, CONTRACT_ABI);

      // Bodhi contract specific - convert byte and byte32 to string
      _.each(formatted, (resultEntry) => {
        if (!_.isEmpty(resultEntry.log)) {
          _.each(resultEntry.log, (logEntry) => {
            _.each(logEntry, (value, key) => {
              // Convert value of field '_name' (byte32[]) and '_resultNames' (byte32[])
              if (key === '_name') {
                logEntry[key] = web3.utils.toAscii(value);
              } else if (key === '_resultNames') {
                logEntry[key] = _.map(value, (val) => web3.utils.toAscii(val));
              } else if (key === '_bettingEndBlock') {
                logEntry[key] = value.toNumber();
              }
            });
          })
        }
      });

      console.log(util.inspect(formatted, { depth: null }));
      done();
    });
  });
});