import { assert } from 'chai';
const BN = require('bn.js');

import Validator from '../src/validator';

describe('Validator', () => {

  describe('isString()', function() {
    it('returns true if a String', async function() {
      assert.isTrue(Validator.isString('a'));
      assert.isTrue(Validator.isString('hello world'));
      assert.isTrue(Validator.isString('1'));
    });

    it('returns false if not a String', async function() {
      assert.isFalse(Validator.isString());
      assert.isFalse(Validator.isString(undefined));
      assert.isFalse(Validator.isString(1));
    });
  });

  describe('isNumber()', function() {
    it('returns true if a Number', async function() {
      assert.isTrue(Validator.isNumber(0));
      assert.isTrue(Validator.isNumber(1));
      assert.isTrue(Validator.isNumber(1.12412));
      assert.isTrue(Validator.isNumber(new BN(12345)));
    });

    it('returns false if not a Number', async function() {
      assert.isFalse(Validator.isNumber());
      assert.isFalse(Validator.isNumber(undefined));
      assert.isFalse(Validator.isNumber('a'));
    });
  });
});
