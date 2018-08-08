const _ = require('lodash');
const Web3Utils = require('web3-utils');
const BigNumber = require('bignumber.js');
const bs58 = require('bs58');

const Utils = require('./utils');
const Constants = require('./constants');

class Encoder {
  /*
   * Encodes a parameter to hex based on its type.
   * @param type {String} The type of the value.
   * @param value {String|Bool|Number|HexNumber|BigNumber|BN} Value to convert to hex.
   * @return The value converted to hex string.
   */
  static encodeParam(type, value) {
    let hex = '';
    if (type.match(Constants.ADDRESS)) {
      if (value instanceof Array) {
        _.each(value, (addr) => {
          hex += this.addressToHex(addr);
        });
      } else {
        hex = this.addressToHex(value);
      }
    } else if (type.match(Constants.BOOL)) {
      if (value instanceof Array) {
        _.each(value, (bool) => {
          hex += this.boolToHex(bool);
        });
      } else {
        hex = this.boolToHex(value);
      }
    } else if (type.match(Constants.REGEX_INT)) { // match order matters here, match int before uint
      if (value instanceof Array) {
        _.each(value, (int) => {
          hex += this.intToHex(int);
        });
      } else {
        hex = this.intToHex(value);
      }
    } else if (type.match(Constants.REGEX_UINT)) {
      if (value instanceof Array) {
        _.each(value, (uint) => {
          hex += this.uintToHex(uint);
        });
      } else {
        hex = this.uintToHex(value);
      }
    } else if (type.match(Constants.REGEX_BYTES)) { // fixed bytes, ie. bytes32
      hex = this.stringToHex(value, Constants.MAX_HEX_CHARS_PER_BYTE);
    } else if (type.match(Constants.REGEX_STATIC_BYTES_ARRAY)) { // fixed bytes array, ie. bytes32[10]
      const arrCapacity = _.toNumber(type.match(Constants.REGEX_NUMBER)[1]);
      if (value instanceof Array) {
        hex = this.stringArrayToHex(value, arrCapacity);
      } else {
        hex = this.stringToHex(value, Constants.MAX_HEX_CHARS_PER_BYTE * arrCapacity);
      }
    } else {
      console.error(`Unimplemented type: ${type}`);
    }

    return hex;
  }

  /*
   * Converts an ABI object signature to its hash format.
   * @param obj The object of the ABI object.
   * @param isFunction Is converting a function object.
   * @return The object hash.
   */
  static objToHash(obj, isFunction) {
    if (_.isUndefined(obj)) {
      throw new Error('obj should not be undefined');
    }
    if (_.isUndefined(isFunction)) {
      throw new Error('isFunction should not be undefined');
    }

    const { name } = obj;
    let params = '';
    for (let i = 0; i < obj.inputs.length; i++) {
      params = params.concat(obj.inputs[i].type);

      if (i < obj.inputs.length - 1) {
        params = params.concat(',');
      }
    }
    const hash = name.concat(`(${params})`);

    if (isFunction) {
      // Return only the first 4 bytes
      return Web3Utils.sha3(hash).slice(2, 10);
    }
    return Web3Utils.sha3(hash).slice(2);
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

    return Web3Utils.padLeft(hexAddr, Constants.MAX_HEX_CHARS_PER_BYTE);
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
   *    bignumber.js: <BigNumber: 3039>
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
   *    bignumber.js: <BigNumber: 3039>
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
    return Web3Utils.padLeft(hexNum, Constants.MAX_HEX_CHARS_PER_BYTE).slice(2);
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
      if (strArray[i] !== undefined) {
        hexString = Web3Utils.utf8ToHex(strArray[i].toString());
      } else {
        hexString = Web3Utils.utf8ToHex('');
      }

      // Remove the 0x hex prefix
      array[i] = Web3Utils
        .padRight(hexString, Constants.MAX_HEX_CHARS_PER_BYTE)
        .slice(2, Constants.MAX_HEX_CHARS_PER_BYTE + 2);
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
    return Web3Utils.padLeft(trimmed, Constants.MAX_HEX_CHARS_PER_BYTE);
  }
}

module.exports = Encoder;
