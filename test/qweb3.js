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
    it('returns the transaction info', async () => {
      assert.isDefined(await qweb3.getTransaction('4c24f818a41c5c4288f5ca288a21477063c67df055946bb54650efad288add56'));
    });
  });

  describe('getTransactionReceipt()', () => {
    it('returns the transaction receipt', async () => {
      assert.isDefined(await qweb3.getTransaction('4c24f818a41c5c4288f5ca288a21477063c67df055946bb54650efad288add56'));
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
