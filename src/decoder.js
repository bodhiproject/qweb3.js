const _ = require('lodash');
const Web3Utils = require('web3-utils');
const crypto = require('crypto');
const bs58 = require('bs58');

const Utils = require('./utils');

const MainnetNetworkByte = '3A';
const TestnetNetworkByte = '78';

class Decoder {
  static toQtumAddress(hexAddress, isMainnet = false) {
    if (hexAddress === undefined || _.isEmpty(hexAddress)) {
      throw new Error('hexAddress should not be undefined or empty');
    }
    if (!Web3Utils.isHex(hexAddress)) {
      throw new Error('Invalid hex address');
    }
    // reference: https://gobittest.appspot.com/Address
    let qAddress = hexAddress;
    // Add network byte
    if (isMainnet) {
      qAddress = MainnetNetworkByte + qAddress;
    } else {
      qAddress = TestnetNetworkByte + qAddress;
    }

    const qAddressBuffer = Buffer.from(qAddress, 'hex');
    // Double SHA256 hash
    const hash1 = crypto.createHash('sha256').update(qAddressBuffer).digest('Hex');
    const hash1Buffer = Buffer.from(hash1, 'hex');
    const hash2 = crypto.createHash('sha256').update(hash1Buffer).digest('Hex');

    // get first 4 bytes
    qAddress += hash2.slice(0, 8);

    // base58 encode
    const address = bs58.encode(Buffer.from(qAddress, 'hex'));
    return address;
  }

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
    } else if (Web3Utils.isHex(value)) {
      value = Utils.trimHexPrefix(value);
    }

    return value;
  }
}

module.exports = Decoder;
