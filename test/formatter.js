import { assert } from 'chai';
import _ from 'lodash';

import Formatter from '../src/formatter';
import ContractMetadata from './data/contract_metadata';

describe('Formatter', () => {
  describe('searchLogOutput()', () => {
    const rawOutput = [
      {
        blockHash: '1bfca6e1c401865982121000a60a5f7f32839e124486891fd2d34bd6e1052de2',
        blockNumber: 50344,
        transactionHash: '4c24f818a41c5c4288f5ca288a21477063c67df055946bb54650efad288add56',
        transactionIndex: 2,
        from: '17e7888aa7412a735f336d2f6d784caefabb6fa3',
        to: 'd53927df927be7fc51ce8bf8b998cb6611c266b0',
        cumulativeGasUsed: 3409568,
        gasUsed: 3409568,
        contractAddress: 'd53927df927be7fc51ce8bf8b998cb6611c266b0',
        log: [
          {
            address: '6d5b0ec97475e8d854efddc81d3a1d0f0f019669',
            topics: [
              'c46e722c8158268af789d6a68206785f8d497869da236f87c2014c1c08fd3dec',
              '0000000000000000000000009697b1f2701ca9434132723ee790d1cb0ab0e414',
              '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3',
              '000000000000000000000000a51f3252ff700df157b4633d1fa563fbcbe6e8fd',
            ],
            data: '4265737420646f6720746f206f776e3f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000426561676c6500000000000000000000000000000000000000000000000000004875736b79000000000000000000000000000000000000000000000000000000476f6c64656e205265747269657665720000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000c4a9000000000000000000000000000000000000000000000000000000000000c4e000000000000000000000000000000000000000000000000000000002540be400',
          },
          {
            address: 'd53927df927be7fc51ce8bf8b998cb6611c266b0',
            topics: [
              'b7fa6f4e0c226cf0645f9f983dbc0bb4bb971400b98fae2387487d6d810c9c56',
              '000000000000000000000000a51f3252ff700df157b4633d1fa563fbcbe6e8fd',
              '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3',
              '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3',
            ],
            data: '4265737420646f6720746f206f776e3f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000426561676c6500000000000000000000000000000000000000000000000000004875736b79000000000000000000000000000000000000000000000000000000476f6c64656e20526574726965766572000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c4a9000000000000000000000000000000000000000000000000000000000000c4e0',
          },
        ],
      },
    ];

    it.only('returns the formatted searchlog output', () => {
      const formatted = Formatter.searchLogOutput(rawOutput, ContractMetadata, true);

      // CentralizedOracleCreated event
      const log0 = formatted[0].log[0];
      assert.equal(log0._eventName, 'CentralizedOracleCreated');
      assert.equal(log0._contractAddress, '9697b1f2701ca9434132723ee790d1cb0ab0e414');
      assert.equal(log0._oracle, '17e7888aa7412a735f336d2f6d784caefabb6fa3');
      assert.equal(log0._eventAddress, 'a51f3252ff700df157b4633d1fa563fbcbe6e8fd');

      const name = [
        '4265737420646f6720746f206f776e3f00000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
      ];
      assert.deepEqual(log0._name, name);

      const resultNames = [
        '426561676c650000000000000000000000000000000000000000000000000000',
        '4875736b79000000000000000000000000000000000000000000000000000000',
        '476f6c64656e2052657472696576657200000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000',
      ];
      assert.deepEqual(log0._resultNames, resultNames);
      assert.equal(log0._numOfResults, 3);
      assert.equal(log0._bettingEndBlock, 0xc4a9);
      assert.equal(log0._resultSettingEndBlock, 0xc4e0);
      assert.equal(log0._consensusThreshold, 0x2540be400);

      // TopicCreated event
      const log1 = formatted[0].log[1];
      assert.equal(log1._eventName, 'TopicCreated');
      assert.equal(log1._topicAddress, 'a51f3252ff700df157b4633d1fa563fbcbe6e8fd');
      assert.equal(log1._creator, '17e7888aa7412a735f336d2f6d784caefabb6fa3');
      assert.equal(log1._oracle, '17e7888aa7412a735f336d2f6d784caefabb6fa3');
      assert.deepEqual(log1._name, name);
      assert.deepEqual(log1._resultNames, resultNames);
      assert.equal(log1._bettingEndBlock, 0xc4a9);
      assert.equal(log1._resultSettingEndBlock, 0xc4e0);
    });

    it('skips decoding for an invalid eventName', () => {
      const withdrawWinningsOutput = [
        {
          blockHash: 'b714317e141e29c9ccf7d051c55ba578cd1adf4239a968db0207673dfe911c66',
          blockNumber: 45038,
          transactionHash: '9ec8809f9d9ddd99011ab1fda176a6974d4839f298e299563844db37e008b41b',
          transactionIndex: 2,
          from: '17e7888aa7412a735f336d2f6d784caefabb6fa3',
          to: '979487ee8c643621d2e3950dbe60edc610d7569a',
          cumulativeGasUsed: 43666,
          gasUsed: 43666,
          contractAddress: '979487ee8c643621d2e3950dbe60edc610d7569a',
          log: [
            {
              address: 'f6177bc9812eeb531907621af6641a41133dea9e',
              topics: [
                'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '000000000000000000000000979487ee8c643621d2e3950dbe60edc610d7569a',
                '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3',
              ],
              data: '000000000000000000000000000000000000000000000000000000037e11d600',
            },
            {
              address: '979487ee8c643621d2e3950dbe60edc610d7569a',
              topics: [
                '64bd7c266edce1b240f0ed2697cdca2e2478fb1dbc18ec833f80cda28a34c029',
                '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3',
              ],
              data: '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000037e11d600',
            },
          ],
        },
      ];

      const badMetadata = {
        TopicEvent: {
          // eslint-disable-next-line max-len, array-bracket-newline, object-curly-newline, object-property-newline
          abi: [{ constant: false, inputs: [{ name: '_resultIndex', type: 'uint8' }, { name: '_sender', type: 'address' }, { name: '_amount', type: 'uint256' }], name: 'voteFromOracle', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'totalBotValue', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [{ name: '_oracleIndex', type: 'uint8' }], name: 'getOracle', outputs: [{ name: '', type: 'address' }, { name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [{ name: '', type: 'address' }], name: 'didWithdraw', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'resultSet', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'status', outputs: [{ name: '', type: 'uint8' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'getFinalResult', outputs: [{ name: '', type: 'uint8' }, { name: '', type: 'string' }, { name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [{ name: '', type: 'uint256' }], name: 'resultNames', outputs: [{ name: '', type: 'bytes32' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [{ name: '', type: 'uint256' }], name: 'oracles', outputs: [{ name: 'didSetResult', type: 'bool' }, { name: 'oracleAddress', type: 'address' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [], name: 'finalizeResult', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: false, inputs: [{ name: '_oracle', type: 'address' }, { name: '_resultIndex', type: 'uint8' }, { name: '_consensusThreshold', type: 'uint256' }], name: 'centralizedOracleSetResult', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'totalQtumValue', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: '_consensusThreshold', type: 'uint256' }], name: 'invalidateOracle', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'getBetBalances', outputs: [{ name: '', type: 'uint256[10]' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'owner', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'calculateQtumContributorWinnings', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'getVoteBalances', outputs: [{ name: '', type: 'uint256[10]' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'getTotalVotes', outputs: [{ name: '', type: 'uint256[10]' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: '_better', type: 'address' }, { name: '_resultIndex', type: 'uint8' }], name: 'bet', outputs: [], payable: true, stateMutability: 'payable', type: 'function' }, { constant: false, inputs: [{ name: '_resultIndex', type: 'uint8' }, { name: '_currentConsensusThreshold', type: 'uint256' }], name: 'votingOracleSetResult', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'getTotalBets', outputs: [{ name: '', type: 'uint256[10]' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'getEventName', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'invalidResultIndex', outputs: [{ name: '', type: 'uint8' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'numOfResults', outputs: [{ name: '', type: 'uint8' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [], name: 'withdrawWinnings', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: false, inputs: [{ name: '_newOwner', type: 'address' }], name: 'transferOwnership', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'calculateBotContributorWinnings', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { inputs: [{ name: '_owner', type: 'address' }, { name: '_centralizedOracle', type: 'address' }, { name: '_name', type: 'bytes32[10]' }, { name: '_resultNames', type: 'bytes32[10]' }, { name: '_bettingEndBlock', type: 'uint256' }, { name: '_resultSettingEndBlock', type: 'uint256' }, { name: '_addressManager', type: 'address' }], payable: false, stateMutability: 'nonpayable', type: 'constructor' }, { payable: true, stateMutability: 'payable', type: 'fallback' }, { anonymous: false, inputs: [{ indexed: true, name: '_eventAddress', type: 'address' }, { indexed: false, name: '_finalResultIndex', type: 'uint8' }], name: 'FinalResultSet', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: '_winner', type: 'address' }, { indexed: false, name: '_qtumTokenWon', type: 'uint256' }, { indexed: false, name: '_botTokenWon', type: 'uint256' }], name: 'WinningsWithdrawn', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: '_previousOwner', type: 'address' }, { indexed: true, name: '_newOwner', type: 'address' }], name: 'OwnershipTransferred', type: 'event' }],
          WithdrawWinnings: '64bd7c266edce1b240f0ed2697cdca2e2478fb1dbc18ec833f80cda28a34c029', // incorrect Event Name
        },
      };

      const formatted = Formatter.searchLogOutput(withdrawWinningsOutput, badMetadata, true);
      assert.isUndefined(formatted[0].log[1]._eventName);
      assert.isUndefined(formatted[0].log[1]._winner);
    });
  });

  describe('callOutput()', () => {
    it('returns the formatted call output for a struct', () => {
      const rawOutput = {
        address: 'dacd16bde8ff9f7689cb8d3363324c77fbb80950',
        executionResult: {
          gasUsed: 22381,
          excepted: 'None',
          newAddress: 'dacd16bde8ff9f7689cb8d3363324c77fbb80950',
          output: '00000000000000000000000000000000000000000000000000000000000000010000000000000000000000009ece13d31f24b1c45107924f9c3fda2eb55eeda7',
          codeDeposit: 0,
          gasRefunded: 0,
          depositSize: 0,
          gasForDeposit: 0,
        },
        transactionReceipt: {
          stateRoot: 'c0886d5ea7204e8f2e6006d5847c8fb6813b0430322476443630f367f50b6a82',
          gasUsed: 22381,
          bloom: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
          log: [
          ],
        },
      };

      const formatted = Formatter.callOutput(rawOutput, ContractMetadata.TopicEvent.abi, 'oracles', true);
      assert.equal(formatted.oracleAddress, '9ece13d31f24b1c45107924f9c3fda2eb55eeda7');
      assert.isTrue(formatted.didSetResult);
    });

    it('returns the formatted call output for uint', () => {
      const rawOutput = {
        address: 'dacd16bde8ff9f7689cb8d3363324c77fbb80950',
        executionResult: {
          gasUsed: 22303,
          excepted: 'None',
          newAddress: 'dacd16bde8ff9f7689cb8d3363324c77fbb80950',
          output: '0000000000000000000000000000000000000000000000000000000000000004',
          codeDeposit: 0,
          gasRefunded: 0,
          depositSize: 0,
          gasForDeposit: 0,
        },
        transactionReceipt: {
          stateRoot: 'c0886d5ea7204e8f2e6006d5847c8fb6813b0430322476443630f367f50b6a82',
          gasUsed: 22303,
          bloom: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
          log: [
          ],
        },
      };

      const formatted = Formatter.callOutput(rawOutput, ContractMetadata.TopicEvent.abi, 'numOfResults', true);
      assert.equal(formatted[0], 4);
    });

    it('returns the formatted call output for address', () => {
      const rawOutput = {
        address: 'dacd16bde8ff9f7689cb8d3363324c77fbb80950',
        executionResult: {
          gasUsed: 22169,
          excepted: 'None',
          newAddress: 'dacd16bde8ff9f7689cb8d3363324c77fbb80950',
          output: '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3',
          codeDeposit: 0,
          gasRefunded: 0,
          depositSize: 0,
          gasForDeposit: 0,
        },
        transactionReceipt: {
          stateRoot: 'c0886d5ea7204e8f2e6006d5847c8fb6813b0430322476443630f367f50b6a82',
          gasUsed: 22169,
          bloom: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
          log: [
          ],
        },
      };

      const formatted = Formatter.callOutput(rawOutput, ContractMetadata.TopicEvent.abi, 'owner', true);
      assert.equal(formatted[0], '17e7888aa7412a735f336d2f6d784caefabb6fa3');
    });
  });
});
