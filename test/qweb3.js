/* global describe,it,beforeEach */
import { assert } from 'chai';

import Qweb3 from '../src/qweb3';

describe('Web3', () => {

  let qweb3;

  beforeEach(() => {

    qweb3 = new Qweb3('http://kezjo:qweASD@localhost:13889');

  });

  describe('methods', () => {
    /** Expect isConnected to be true when connect with basic Auth */
    it('isConnected with basic auth', () => {

      return qweb3.isConnected()
        .then((res) => {
          assert.isTrue(res);
        });
    });

    /** Expect isConnected to be false when connect without basic Auth */
    it('isConnected without basic auth', () => {

      return qweb3.isConnected()
        .then((res) => {
          assert.isFalse(res);
        });
    });

    /** Make sure getTransaction returns result */
    it('getTransaction', () => {

      return qweb3.getTransaction('481d49ee544b65e769e71f2ecaa4a2b07133d0e0081abf80efaf9fdfefd59db7')
        .then((res) => {
          assert.isDefined(res);
        });
    });
  });
});