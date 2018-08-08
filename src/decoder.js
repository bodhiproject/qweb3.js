const { isEmpty, each, find } = require('lodash');
const Web3Utils = require('web3-utils');
const EthjsAbi = require('ethjs-abi');
const crypto = require('crypto');
const bs58 = require('bs58');

const Utils = require('./utils');

const MainnetNetworkByte = '3A';
const TestnetNetworkByte = '78';

class Decoder {
  static toQtumAddress(hexAddress, isMainnet = false) {
    if (hexAddress === undefined || isEmpty(hexAddress)) {
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

    let v = value;
    if (v instanceof Array) {
      each(v, (arrayItem, index) => {
        if (Web3Utils.isHex(arrayItem)) {
          v[index] = Utils.trimHexPrefix(arrayItem);
        }
      });
    } else if (Web3Utils.isHex(value)) {
      v = Utils.trimHexPrefix(value);
    }

    return v;
  }

  /**
   * Decodes the output of a callcontract and puts it in executionResult.formattedOutput
   * @param {object} rawOutput Raw output of callcontract.
   * @param {object} contractABI The ABI of the contract that was called.
   * @param {string} methodName The name of the method that was called.
   * @param {bool} removeHexPrefix Flag to indicate whether to remove the hex prefix (0x) from hex values.
   * @return {object} Decoded callcontract output.
   */
  static decodeCall(rawOutput, contractABI, methodName, removeHexPrefix = true) {
    if (!rawOutput) {
      throw Error('rawOutput is undefined.');
    }
    if (!contractABI) {
      throw Error('contractABI is undefined.');
    }
    if (!methodName) {
      throw Error('methodName is undefined.');
    }

    const output = rawOutput;
    const methodABI = find(contractABI, { name: methodName });
    if (methodABI && 'executionResult' in output && 'output' in output.executionResult) {
      let formattedOutput = EthjsAbi.decodeMethod(
        methodABI,
        Utils.appendHexPrefix(output.executionResult.output),
      );
      if (removeHexPrefix) {
        formattedOutput = Decoder.removeHexPrefix(formattedOutput);
      }
      output.executionResult.formattedOutput = formattedOutput;
    }
    return output;
  }
}

module.exports = Decoder;
