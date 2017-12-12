/* global describe,it,beforeEach */
const assert = require('chai').assert;
import util from 'util';

import _ from 'lodash';
import Qweb3 from '../src/qweb3';
import Contracts from './data/Contracts';
import utils from '../src/utils';

describe('Contract EventFactory', () => {

  let qweb3;
  let contract;

  beforeEach(() => {

    qweb3 = new Qweb3('http://bodhi:bodhi@localhost:13889');
    contract = new qweb3.Contract(Contracts.EventFactory.address, Contracts.EventFactory.abi);

    // TODO: Enter wallet passphrase
  });

  describe('methods', () => {
    /** Create a topic with sendtocontract and make sure txid returned */
    it('createTopic', () => {

      // TODO: Get sender address with unspent balance first

      const resultSetter = '0x5089a838dc9b27174c3b7a0314c6a6219d3002ed';

      let name = utils.toHex('firstTopic');

      name = utils.formatHexStr(name);

      let resultNames = new Array(10).fill('\u0000');
      resultNames[0] = utils.toHex('result1');
      resultNames[1] = utils.toHex('result2');
      resultNames = _.map(resultNames, (value) => utils.toHex(value));

      const bettingEndBlock = 33000;

      return contract.send('createTopic', {
          senderAddress: 'qX1wv2426uABCJFqcqauCMGuXZv2unZYcd',
          data: [resultSetter, name, resultNames, bettingEndBlock],
        })
        .then((res) => {
          console.log(res);
          assert.isDefined(res.txid);
        });
    });

    /** Make sure topics returns created topics */
    it('topics', () => {

      const name = Buffer.from('firstTopic', 'utf-8');
      const resultNames = [Buffer.from('firstResult', 'utf-8'), Buffer.from('secondResult', 'utf-8')];
      const bettingEndBlock = 33000;

      return contract.call('topics', '382e62114f64d453f3b5c053e57839bdd9a0bfb9d63acd772a7b1572ffdd5df7')
        .then((res) => {
          console.log(res);
          assert.isDefined(res.executionResult.output);
        });
    });

    /** Make sure doesTopicExist returns created topics */
    it('doesTopicExist', () => {

      const name = Buffer.from('firstTopic', 'utf-8');
      const resultNames = [Buffer.from('result1', 'utf-8'), Buffer.from('result2', 'utf-8')];
      const bettingEndBlock = 33000;

      return contract.call('doesTopicExist', [name, resultNames, bettingEndBlock])
        .then((res) => {
          console.log(res);
          assert.isDefined(res.executionResult.output);
        });
    });

    /** Search past topics and validate results */
    it('searchLogs', () => {

      const fromBlock = 0;
      const toBlock = -1;
      const addresses = Contracts.EventFactory.address;
      const topics = ['null'];

      return contract.searchLogs(fromBlock, toBlock, addresses, topics)
        .then((res) => {
          console.log(`Retrieved ${res.length} entries from searchLogs.`);

          res.forEach((entry, index) => {
            console.log(`Entry #${index} contains ${entry.log.length} logs.`);
            console.log(util.inspect(entry, { depth: null }));
          });
        });
    });
  });
});