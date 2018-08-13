/* eslint-disable no-underscore-dangle, max-len */
const chai = require('chai');

const Formatter = require('../formatter');
const ContractMetadata = require('../../../test/data/contract_metadata');

const { assert } = chai;

describe('Formatter', () => {
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
/* eslint-enable no-underscore-dangle, max-len */
