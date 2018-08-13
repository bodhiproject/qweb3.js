/* eslint-disable no-underscore-dangle, max-len */
const chai = require('chai');

const { initProvider } = require('..');
const HttpProvider = require('../http-provider');
const Decoder = require('../../formatters/decoder');

const { assert } = chai;

describe('Providers', () => {
  describe('initProvider', () => {
    it('accepts a url string', () => {
      const instance = initProvider('http://bodhi:bodhi@localhost:13889');
      assert.isDefined(instance);
      assert.isTrue(instance.constructor.name === 'HttpProvider');
    });

    it('accepts an HttpProvider', () => {
      const instance = initProvider(new HttpProvider('http://bodhi:bodhi@localhost:13889'));
      assert.isDefined(instance);
      assert.isTrue(instance.constructor.name === 'HttpProvider');
    });

    it('throws if not a compatible provider', () => {
      assert.throws(() => initProvider(new Decoder()));
    });
  });
});
/* eslint-enable no-underscore-dangle, max-len */
