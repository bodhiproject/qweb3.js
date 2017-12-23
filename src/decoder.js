const Web3Utils = require('web3-utils');
const bs58 = require('bs58');

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
  }
}

module.exports = Decoder;
