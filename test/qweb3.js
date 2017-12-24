import { assert } from 'chai';
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
    it('returns true when connected', function() {
      qweb3.isConnected()
      .then(function(res) {
        assert.isTrue(res);
      });
    });
  });

  describe('getHexAddress()', function() {
    it('returns the hex address', function() {
      qweb3.getHexAddress(QTUM_ADDRESS)
      .then(function(res) {
        assert.equal(res, '17e7888aa7412a735f336d2f6d784caefabb6fa3');
      });
    });
  });

  describe('fromHexAddress()', function() {
    it('returns the qtum address', function() {
      qweb3.getHexAddress('17e7888aa7412a735f336d2f6d784caefabb6fa3')
      .then(function(res) {
        assert.equal(res, QTUM_ADDRESS);
      });
    });
  });

  describe('getBlockCount()', function() {
    it('returns the blockcount', function() {
      qweb3.getBlockCount()
      .then(function(res) {
        assert.isDefined(res);
        assert.isNumber(res);
      });
    });
  });

  describe('getTransaction()', function() {
    it('returns the transaction info', function() {
      qweb3.getTransaction('481d49ee544b65e769e71f2ecaa4a2b07133d0e0081abf80efaf9fdfefd59db7')
      .then(function(res) {
        assert.isDefined(res);
      });
    });
  });

  describe('getTransactionReceipt()', function() {
    it('returns the transaction receipt', function() {
      qweb3.getTransaction('481d49ee544b65e769e71f2ecaa4a2b07133d0e0081abf80efaf9fdfefd59db7')
      .then(function(res) {
        assert.isDefined(res);
      });
    });
  });

  describe('listUnspent()', function() {
    it('returns an unspent output array', function() {
      qweb3.listUnspent()
      .then(function(res) {
        assert.isDefined(res);
        assert.isArray(res);
      });
    });
  });

  describe('searchLogs()', function() {
    it('returns an array of logs', function() {
      qweb3.searchLogs(50000, 50100, [], ['c46e722c8158268af789d6a68206785f8d497869da236f87c2014c1c08fd3dec'], Contracts, true)
      .then(function(res) {
        assert.isDefined(res);
        assert.isArray(res);
      });
    });
  });
});
