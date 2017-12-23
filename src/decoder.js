const Web3Utils = require('web3-utils');
const bs58 = require('bs58');
const Utils = require('./utils');

class Decoder {

  static toQtumAddress(hexAddress) {
    if (!hexAddress) {
      throw new Error(`hexAddress should not be undefined.`);
    }
    if (!Web3Utils.isHex(hexAddress)) {
      throw new Error(`Invalid hex address.`);
    }

    const bytes = Buffer.from(hexAddress, 'hex');
    const address = bs58.encode(bytes);
    return address;
  };

  static removeHexPrefix(value) {
    if (value === undefined) {
      return false;
    }

    if (value instanceof Array) {
      _.each(value, (arrayItem, index) => {
        if (Web3Utils.isHex(arrayItem)) {
          value[index] = Utils.trimHexPrefix(arrayItem);
        }
      });
    } else {
      if (Web3Utils.isHex(value)) {
        value = Utils.trimHexPrefix(value);   
      }
    }

    return value;
  };
}

module.exports = Decoder;
