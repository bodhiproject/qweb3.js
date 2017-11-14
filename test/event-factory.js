/* global describe,it,beforeEach*/
import Qweb3 from '../src/qweb3';
var web3 = require('web3'); // This will import the web3 library.

const assert = require('chai').assert;
const EF_ADDRESS = 'f6464ab9222b959a50765ac5c4889f8c3fe24241';
const EF_ABI = [{ "constant": true, "inputs": [{ "name": "", "type": "bytes32" }], "name": "topics", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_resultSetter", "type": "address" }, { "name": "_name", "type": "bytes" }, { "name": "_resultNames", "type": "bytes32[]" }, { "name": "_bettingEndBlock", "type": "uint256" }], "name": "createTopic", "outputs": [{ "name": "tokenAddress", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_name", "type": "bytes" }, { "name": "_resultNames", "type": "bytes32[]" }, { "name": "_bettingEndBlock", "type": "uint256" }], "name": "doesTopicExist", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "_addressManager", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_creator", "type": "address" }, { "indexed": false, "name": "_topicEvent", "type": "address" }, { "indexed": false, "name": "_name", "type": "bytes" }, { "indexed": false, "name": "_resultNames", "type": "bytes32[]" }, { "indexed": false, "name": "_bettingEndBlock", "type": "uint256" }], "name": "TopicCreated", "type": "event" }];


describe('Contract EventFactory', () => {

  beforeEach(() => {});

  describe('methods', () => {

    it('createTopic', () => {

      let qweb3 = new Qweb3(`http://kezjo:qweASD@localhost:13889`);

      let contract = new qweb3.Contract(EF_ADDRESS, EF_ABI);

      let resultSetter = '0x5089a838dc9b27174c3b7a0314c6a6219d3002ed';
      let name = "firstTopic";
      let resultNames = ["result1", "result2"];
      let bettingEndBlock = 33000;

      return contract.send('createTopic', {
          senderAddress: 'qJwHyGcExveuVtiakx29Kbk2yp6hwMZF8u',
          data: [resultSetter, name, resultNames, bettingEndBlock]
        })
        .then((res) => {
          console.log(res);
          assert.isDefined(res.txid);
        });
    });

    it('topics', () => {

      let qweb3 = new Qweb3(`http://kezjo:qweASD@localhost:13889`);

      let contract = new qweb3.Contract(EF_ADDRESS, EF_ABI);

      let name = new Buffer("firstTopic", "utf-8");
      let resultNames = [new Buffer("firstResult", "utf-8"), new Buffer("secondResult", "utf-8")];
      let bettingEndBlock = 33000;

      return contract.call('topics', "382e62114f64d453f3b5c053e57839bdd9a0bfb9d63acd772a7b1572ffdd5df7")
        .then((res) => {
          console.log(res);
          assert.isDefined(res.executionResult.output);
        });
    });

    it('doesTopicExist', () => {

      let qweb3 = new Qweb3(`http://kezjo:qweASD@localhost:13889`);

      let contract = new qweb3.Contract(EF_ADDRESS, EF_ABI);

      let name = new Buffer("firstTopic", "utf-8");
      let resultNames = [new Buffer("result1", "utf-8"), new Buffer("result2", "utf-8")];
      let bettingEndBlock = 33000;

      return contract.call('doesTopicExist', [name, resultNames, bettingEndBlock])
        .then((res) => {
          console.log(res);
          assert.isDefined(res.executionResult.output);
        });
    });

    it('searchLogs', () => {

      let qweb3 = new Qweb3(`http://kezjo:qweASD@localhost:13889`);

      let contract = new qweb3.Contract(EF_ADDRESS, EF_ABI);

      let fromBlock = 0;
      let toBlock = -1;
      let addresses = 'f6464ab9222b959a50765ac5c4889f8c3fe24241';
      let topics = ["null"];

      return contract.searchLogs(fromBlock, toBlock, addresses, topics)
        .then((res) => {

          console.log(`Retrieved ${res.length} entries from searchLogs.`);

          res.forEach((entry, index) => {

            console.log(`Entry #${index} contains ${entry.log.length} logs.`);
            console.log(entry);
            // entry.log.forEach((logEntry, logIndex) => {
            //   console.log('Log #' + logIndex, logEntry);
            //   if (logEntry.data) {
            //     console.log("data translation: ", web3.utils.toAscii('0x' + logEntry.data));
            //   }
            // });
          });
        });
    });

  })
});