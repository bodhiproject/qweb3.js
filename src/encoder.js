import _ from 'lodash';
import Web3Utils from 'web3-utils';
import BigNumber from 'bignumber.js';
import bs58 from 'bs58';

import Utils from './utils';

const PADDED_BYTES = 64;

class Encoder {
  /*
   * Converts an object of a method from the ABI to a function hash.
   * @param methodObj The json object of the method taken from the ABI.
   * @return The function hash.
   */
  static getFunctionHash(methodObj) {
    if (!methodObj) {
      throw new Error('methodObj should not be undefined');
    }

    const name = methodObj.name;
    let params = '';
    for (let i = 0; i < methodObj.inputs.length; i++) {
      params = params.concat(methodObj.inputs[i].type);

      if (i < methodObj.inputs.length - 1) {
        params = params.concat(',');
      }
    }
    const signature = name.concat('(').concat(params).concat(')');

    // Return only the first 4 bytes
    return Web3Utils.sha3(signature).slice(2, 10);
  }

  /*
   * Converts a Qtum or hex address to a padded hex string.
   * @param address The Qtum/hex address to convert.
   * @return The 32 bytes padded-left hex string.
   */
  static addressToHex(address) {
    if (!address) {
      throw new Error('address should not be undefined');
    }

    // Remove '0x' from beginning of address
    const addr = Utils.trimHexPrefix(address);

    let hexAddr;
    if (Web3Utils.isHex(addr)) {
      hexAddr = addr;
    } else {
      const bytes = bs58.decode(addr);
      hexAddr = bytes.toString('hex');
      hexAddr = hexAddr.slice(2, 42); // Removes first byte (version) & last 4 bytes (checksum)
    }

    return Web3Utils.padLeft(hexAddr, PADDED_BYTES);
  }

  /*
   * Converts a boolean to hex padded-left to 32 bytes. Accepts it in true/false or 1/0 format.
   * @param value The boolean to convert.
   * @return The converted boolean to padded-left hex string.
   */
  static boolToHex(value) {
    if (_.isUndefined(value)) {
      throw new Error('value should not be undefined');
    }

    return this.uintToHex(value ? 1 : 0);
  }

  /*
   * Converts an int to hex padded-left to 32 bytes.
   * Accepts the following formats:
   *    decimal: 12345
   *    string: '-12345'
   *    hex string (with 0x hex prefix): '0xbd614e' or 0xbd614e
   *    BN.js: <BN: 3039>
   * @param num The number to convert.
   * @return The converted int to padded-left hex string.
   */
  static intToHex(num) {
    if (_.isUndefined(num)) {
      throw new Error('num should not be undefined');
    }

    return Web3Utils.toTwosComplement(num).slice(2);
  }

  /*
   * Converts a uint to hex padded-left to 32 bytes.
   * Accepts the following formats:
   *    decimal: 12345
   *    string: '12345'
   *    hex string (with 0x hex prefix): '0xbd614e' or 0xbd614e
   *    BN.js: <BN: 3039>
   * @param num The number to convert.
   * @return The converted uint to padded-left hex string.
   */
  static uintToHex(num) {
    if (_.isUndefined(num)) {
      throw new Error('num should not be undefined');
    }

    let bigNum;
    if (Web3Utils.isHexStrict(num)) {
      bigNum = new BigNumber(num, 16);
    } else {
      bigNum = new BigNumber(num, 10);
    }
    
    const hexNum = Web3Utils.numberToHex(bigNum);
    return Web3Utils.padLeft(hexNum, PADDED_BYTES).slice(2);
  }

  /*
   * Converts a string into a hex string up to the max length.
   * @param {string} string The string to convert to hex.
   * @param {number} maxCharLen The total length of the hex string allowed.
   * @return The converted string to single padded-right hex string.
   */
  static stringToHex(string, maxCharLen) {
    if (!_.isString(string)) {
      throw new Error('string should be a String');
    }
    if (!_.isNumber(maxCharLen)) {
      throw new Error('maxCharLen should be a Number');
    }

    let hexString = Web3Utils.utf8ToHex(string);
    hexString = Web3Utils.padRight(hexString, maxCharLen).slice(2, maxCharLen + 2);

    return hexString;
  }

  /*
   * Converts an array of string elements (max 32 bytes) into a concatenated hex string.
   * @param strArray The string array to convert to hex.
   * @param numOfItems The total number of items the string array should have.
   * @return The converted string array to single padded-right hex string.
   */
  static stringArrayToHex(strArray, numOfItems) {
    if (!Array.isArray(strArray)) {
      throw new Error('strArray is not an Array');
    }
    if (!_.isNumber(numOfItems)) {
      throw new Error('numOfItems is not a Number');
    }
    if (numOfItems <= 0) {
      throw new Error('numOfItems should be greater than 0');
    }

    const array = new Array(10);
    for (let i = 0; i < numOfItems; i++) {
      let hexString;
      if (strArray[i] != undefined) {
        hexString = Web3Utils.utf8ToHex(strArray[i].toString());
      } else {
        hexString = Web3Utils.utf8ToHex('');
      }

      // Remove the 0x hex prefix
      array[i] = Web3Utils.padRight(hexString, PADDED_BYTES).slice(2, PADDED_BYTES + 2);
    }

    return array.join('');
  }

  /*
   * Pads a hex string padded-left to 32 bytes.
   * @param {String} hexStr The hex string to pad.
   * @return {String} The padded-left hex string.
   */
  static padHexString(hexStr) {
    if (_.isUndefined(hexStr)) {
      throw new Error('hexStr should not be undefined');
    }
    if (!Web3Utils.isHex(hexStr)) {
      throw new TypeError('hexStr should be a hex string');
    }

    const trimmed = Utils.trimHexPrefix(hexStr);
    return Web3Utils.padLeft(trimmed, PADDED_BYTES);
  }
}

module.exports = Encoder;
