const _ = require('lodash');
const chai = require('chai');

const assert = chai.assert;

module.exports = class QAssert {

  static isQtumAddress(address) {
    assert.isDefined(address);
    assert.equal(_.size(address), 34);
    assert.isTrue(address.startsWith('q') || address.startsWith('Q'));
  }
};
