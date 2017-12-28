import _ from 'lodash';
import Web3Utils from 'web3-utils';
import crypto from 'crypto';
import bs58 from 'bs58';
import Utils from './utils';

const MainnetNetworkByte = '3A';
const TestnetNetworkByte = '78';

class Decoder {

  static toQtumAddress(hexAddress, isMainnet=false) {
    if (hexAddress === undefined || _.isEmpty(hexAddress)) {
      throw new Error(`hexAddress should not be undefined or empty`);
    }
    if (!Web3Utils.isHex(hexAddress)) {
      throw new Error(`Invalid hex address`);
    }
    // reference: https://gobittest.appspot.com/Address
    let qAddress = hexAddress;
    // Add network byte
    if (isMainnet) {
      qAddress = MainnetNetworkByte + qAddress;
    } else {
      qAddress = TestnetNetworkByte + qAddress;
    }

    let qAddressBuffer = Buffer.from(qAddress, 'hex');
    // Double SHA256 hash
    let hash1 = crypto.createHash('sha256').update(qAddressBuffer).digest('Hex');
    let hash1Buffer = Buffer.from(hash1, 'hex');
    let hash2 = crypto.createHash('sha256').update(hash1Buffer).digest('Hex');

    // get first 4 bytes
    qAddress = qAddress + hash2.slice(0, 8);

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
    } else {
      if (Web3Utils.isHex(value)) {
        value = Utils.trimHexPrefix(value);
      }
    }

    return value;
  }
}

module.exports = Decoder;
