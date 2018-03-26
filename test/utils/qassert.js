const _ = require('lodash');

module.exports = class QAssert {

  static isQtumAddress(address) {
    assert.isDefined(address);
    assert.isEqual(_.size(address), 34);
    assert.isTrue(address.startsWith('q') || address.startsWith('Q'));
  }
};
