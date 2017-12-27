import { assert, expect } from 'chai';
import 'babel-polyfill';
import Qweb3 from '../src/qweb3';
import Config from './config/config';
import Contracts from './data/contracts';

describe('Qweb3', () => {
  const QTUM_ADDRESS = 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy';
  let qweb3;

  beforeEach(function() {
    qweb3 = new Qweb3(Config.QTUM_RPC_ADDRESS);
  });

  describe('isConnected()', function() {
    it('returns true when connected', async function() {
      assert.isTrue(await qweb3.isConnected());
    });
  });

  describe('getHexAddress()', function() {
    it('returns the hex address', async function() {
      assert.equal(await qweb3.getHexAddress(QTUM_ADDRESS), '17e7888aa7412a735f336d2f6d784caefabb6fa3');
    });
  });

  describe('fromHexAddress()', function() {
    it('returns the qtum address', async function() {
      assert.equal(await qweb3.fromHexAddress('17e7888aa7412a735f336d2f6d784caefabb6fa3'), QTUM_ADDRESS);
    });
  });

  describe('getBlockCount()', function() {
    it('returns the blockcount', async function() {
      const res = await qweb3.getBlockCount();
      assert.isDefined(res);
      assert.isNumber(res);
    });
  });

  describe('getTransaction()', function() {
    it('returns the transaction info', async function() {
      assert.isDefined(await qweb3.getTransaction('4c24f818a41c5c4288f5ca288a21477063c67df055946bb54650efad288add56'));
    });
  });

  describe('getTransactionReceipt()', function() {
    it('returns the transaction receipt', async function() {
      assert.isDefined(await qweb3.getTransaction('4c24f818a41c5c4288f5ca288a21477063c67df055946bb54650efad288add56'));
    });
  });

  describe('listUnspent()', function() {
    it('returns an unspent output array', async function() {
      const res = await qweb3.listUnspent();
      assert.isDefined(res);
      assert.isArray(res);
    });
  });

  describe('searchLogs()', function() {
    it('returns an array of logs', async function() {
      const res = await qweb3.searchLogs(50000, 50100, [], 
        ['c46e722c8158268af789d6a68206785f8d497869da236f87c2014c1c08fd3dec'], Contracts, true);
      assert.isDefined(res);
      assert.isArray(res);
    });

    it('throws if fromBlock is not a number', async function() {
      assert.throws(() => qweb3.searchLogs('a', 50100, [], 
        ['c46e722c8158268af789d6a68206785f8d497869da236f87c2014c1c08fd3dec'], Contracts, true), Error);
    });

    it('throws if toBlock is not a number', async function() {
      assert.throws(() => qweb3.searchLogs(50000, 'a', [], 
        ['c46e722c8158268af789d6a68206785f8d497869da236f87c2014c1c08fd3dec'], Contracts, true), Error);
    });

    it('throws if addresses is not a string or array', async function() {
      assert.throws(() => qweb3.searchLogs(50000, 50100, undefined, 
        ['c46e722c8158268af789d6a68206785f8d497869da236f87c2014c1c08fd3dec'], Contracts, true), Error);

      assert.throws(() => qweb3.searchLogs(50000, 50100, 1, 
        ['c46e722c8158268af789d6a68206785f8d497869da236f87c2014c1c08fd3dec'], Contracts, true), Error);
    });

    it('throws if topics is not a string or array', async function() {
      assert.throws(() => qweb3.searchLogs(50000, 50100, undefined, 
        ['c46e722c8158268af789d6a68206785f8d497869da236f87c2014c1c08fd3dec'], Contracts, true), Error);

      assert.throws(() => qweb3.searchLogs(50000, 50100, 1, 
        ['c46e722c8158268af789d6a68206785f8d497869da236f87c2014c1c08fd3dec'], Contracts, true), Error);
    });
  });
});
