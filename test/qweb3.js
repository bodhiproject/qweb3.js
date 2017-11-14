/* global describe,it,beforeEach*/
import Qweb3 from '../src/qweb3';

const assert = require('chai').assert;

describe('Web3', () => {

  beforeEach(() => {});

  describe('methods', () => {

    /** Expect isConnected to be true when connect with basic Auth */
    it('isConnected with basic auth', () => {

      let qweb3 = new Qweb3(`http://kezjo:qweASD@localhost:13889`);

      return qweb3.isConnected()
        .then((res) => {
          assert.isTrue(res);
        });
    });

    /** Expect isConnected to be false when connect without basic Auth */
    it('isConnected without basic auth', () => {

      let qweb3 = new Qweb3(`http://localhost:13889`);

      return qweb3.isConnected()
        .then((res) => {
          assert.isFalse(res);
        });
    });  

    /** Make sure getTransaction returns result */
    it('getTransaction', () => {

      let qweb3 = new Qweb3(`http://kezjo:qweASD@localhost:13889`);

      return qweb3.getTransaction('481d49ee544b65e769e71f2ecaa4a2b07133d0e0081abf80efaf9fdfefd59db7')
        .then((res) => {
          assert.isDefined(res);
        });
    });    
  });
});