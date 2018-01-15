import 'babel-polyfill';
import { assert, expect } from 'chai';
import Qweb3 from '../src/qweb3';
import Config from './config/config';
import ContractMetadata from './data/contract_metadata';

describe('Qweb3', () => {
  const QTUM_ADDRESS = 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy';
  let qweb3;

  beforeEach(() => {
    qweb3 = new Qweb3(Config.QTUM_RPC_ADDRESS);
  });

  describe('isConnected()', () => {
    it('returns true when connected', async () => {
      assert.isTrue(await qweb3.isConnected());
    });
  });

  describe('getHexAddress()', () => {
    it('returns the hex address', async () => {
      assert.equal(await qweb3.getHexAddress(QTUM_ADDRESS), '17e7888aa7412a735f336d2f6d784caefabb6fa3');
    });
  });

  describe('fromHexAddress()', () => {
    it('returns the qtum address', async () => {
      assert.equal(await qweb3.fromHexAddress('17e7888aa7412a735f336d2f6d784caefabb6fa3'), QTUM_ADDRESS);
    });
  });

  describe('getBlockCount()', () => {
    it('returns the blockcount', async () => {
      const res = await qweb3.getBlockCount();
      assert.isDefined(res);
      assert.isNumber(res);
    });
  });

  describe('getTransaction()', () => {
    it('returns the transaction info', () => {
      const res = {
        "amount": 0.00000000,
        "fee": -0.10153600,
        "confirmations": 384,
        "blockhash": "2aca546e5adb3a6e2ac38c5cba81f2ce40097a8982d8b6ef37795729048c48f3",
        "blockindex": 2,
        "blocktime": 1515935856,
        "txid": "e5ffaafc8cf5a239750075ac1866537bc3999561e2bbd7012bc80b24e0338cbb",
        "walletconflicts": [
        ],
        "time": 1515935586,
        "timereceived": 1515935586,
        "bip125-replaceable": "no",
        "details": [
          {
            "account": "",
            "category": "send",
            "amount": 0.00000000,
            "vout": 0,
            "fee": -0.10153600,
            "abandoned": false
          }, 
          {
            "account": "",
            "address": "qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy",
            "category": "send",
            "amount": -0.23241276,
            "label": "main",
            "vout": 1,
            "fee": -0.10153600,
            "abandoned": false
          }, 
          {
            "account": "main",
            "address": "qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy",
            "category": "receive",
            "amount": 0.23241276,
            "label": "main",
            "vout": 1
          }
        ],
        "hex": "02000000021e11e4f1db2750a4190f6e3e501f4e85a1e16fa5fe87c40c11ffea351a25cdcc010000006b483045022100a376052aa83c5759eb68e73a0548838a715fcd5225d91346e7709b75b41a74130220481ff6668ca29551a200e71401e946dd6d25ba2b4a5763b8a1666ab59352f0070121038e8b6337a06712e40277d339b4643897e62b337b66eea2d8dd069812d7feb0a3feffffffa39827892bbcfc931a49a2bd6d289a700c8f921caa35d7a5b77373a953592977010000006b483045022100923b8825b5703a21add857fd129daf3f9911c9b5fac0d381a59fe2fd190e81b602201c469fd9378302823320d6bfa2bb502d743eb6843f5d62d6ee8c55ce5dfc50270121038e8b6337a06712e40277d339b4643897e62b337b66eea2d8dd069812d7feb0a3feffffff0200000000000000002301040390d00301280461cac4181497c781c612ad23f4049f253bd52ac2889855f2dac23ca26201000000001976a91417e7888aa7412a735f336d2f6d784caefabb6fa388ac930a0100"
      };
      assert.isDefined(res);
      assert.isDefined(res.amount);
      assert.isDefined(res.fee);
      assert.isDefined(res.confirmations);
      assert.isDefined(res.blockhash);
      assert.isDefined(res.blockindex);
      assert.isDefined(res.txid);
      assert.isDefined(res.walletconflicts);
      assert.isDefined(res.time);
      assert.isDefined(res.timereceived);
      assert.isDefined(res['bip125-replaceable']);
      assert.isDefined(res.hex);
      assert.isDefined(res.details);
    });
  });

  describe('getTransactionReceipt()', () => {
    it('returns the transaction receipt', () => {
      const res = [
        {
          "blockHash": "2aca546e5adb3a6e2ac38c5cba81f2ce40097a8982d8b6ef37795729048c48f3",
          "blockNumber": 68245,
          "transactionHash": "e5ffaafc8cf5a239750075ac1866537bc3999561e2bbd7012bc80b24e0338cbb",
          "transactionIndex": 2,
          "from": "17e7888aa7412a735f336d2f6d784caefabb6fa3",
          "to": "97c781c612ad23f4049f253bd52ac2889855f2da",
          "cumulativeGasUsed": 43448,
          "gasUsed": 43448,
          "contractAddress": "97c781c612ad23f4049f253bd52ac2889855f2da",
          "log": [
            {
              "address": "0387da9a3e773b559ca0367c5929360e4a4294f6",
              "topics": [
                "14959b24f45a8f41b814b331ae09533db9d7e7962ca200e484f849a1fd1955aa", 
                "0000000000000000000000000000000000000000000000000000000000000000", 
                "0000000000000000000000000387da9a3e773b559ca0367c5929360e4a4294f6"
              ],
              "data": "0000000000000000000000000000000000000000000000000000000000000002"
            }
          ]
        }
      ];
      assert.isDefined(res);
      assert.isDefined(res[0].blockHash);
      assert.isDefined(res[0].blockNumber);
      assert.isDefined(res[0].transactionHash);
      assert.isDefined(res[0].transactionIndex);
      assert.isDefined(res[0].from);
      assert.isDefined(res[0].to);
      assert.isDefined(res[0].cumulativeGasUsed);
      assert.isDefined(res[0].gasUsed);
      assert.isDefined(res[0].contractAddress);
      assert.isDefined(res[0].log);
    });
  });

  describe('listUnspent()', () => {
    it('returns an unspent output array', async () => {
      const res = await qweb3.listUnspent();
      assert.isDefined(res);
      assert.isArray(res);
    });
  });

  describe('searchLogs()', () => {
    it('returns an array of logs', async () => {
      const res = await qweb3.searchLogs(
        50000, 50100, [],
        ['c46e722c8158268af789d6a68206785f8d497869da236f87c2014c1c08fd3dec'], ContractMetadata, true,
      );
      assert.isDefined(res);
      assert.isArray(res);
    });

    it('throws if fromBlock is not a number', async () => {
      assert.throws(() => qweb3.searchLogs(
        'a', 50100, [],
        ['c46e722c8158268af789d6a68206785f8d497869da236f87c2014c1c08fd3dec'], ContractMetadata, true,
      ), Error);
    });

    it('throws if toBlock is not a number', async () => {
      assert.throws(() => qweb3.searchLogs(
        50000, 'a', [],
        ['c46e722c8158268af789d6a68206785f8d497869da236f87c2014c1c08fd3dec'], ContractMetadata, true,
      ), Error);
    });

    it('throws if addresses is not a string or array', async () => {
      assert.throws(() => qweb3.searchLogs(
        50000, 50100, undefined,
        ['c46e722c8158268af789d6a68206785f8d497869da236f87c2014c1c08fd3dec'], ContractMetadata, true,
      ), Error);

      assert.throws(() => qweb3.searchLogs(
        50000, 50100, 1,
        ['c46e722c8158268af789d6a68206785f8d497869da236f87c2014c1c08fd3dec'], ContractMetadata, true,
      ), Error);
    });

    it('throws if topics is not a string or array', async () => {
      assert.throws(() => qweb3.searchLogs(
        50000, 50100, undefined,
        ['c46e722c8158268af789d6a68206785f8d497869da236f87c2014c1c08fd3dec'], ContractMetadata, true,
      ), Error);

      assert.throws(() => qweb3.searchLogs(
        50000, 50100, 1,
        ['c46e722c8158268af789d6a68206785f8d497869da236f87c2014c1c08fd3dec'], ContractMetadata, true,
      ), Error);
    });
  });
});
