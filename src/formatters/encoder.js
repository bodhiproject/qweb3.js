const _ = require('lodash');
const Web3Utils = require('web3-utils');
const BigNumber = require('bignumber.js');
const bs58 = require('bs58');

const Utils = require('../utils');
const Constants = require('../constants');

class Encoder {
  /**
   * Converts an ABI object signature to its hash format.
   * @param {object} obj The object of the ABI object.
   * @param {boolean} isFunction Is converting a function object.
   * @return {string} The object hash.
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

  /**
   * Converts a Qtum or hex address to a padded hex string.
   * @param {string} address The Qtum/hex address to convert.
   * @return {string} The 32 bytes padded-left hex string.
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

  /**
   * Converts a boolean to hex padded-left to 32 bytes. Accepts it in true/false or 1/0 format.
   * @param {boolean} value The boolean to convert.
   * @return {string} The converted boolean to padded-left hex string.
   */
  static boolToHex(value) {
    if (_.isUndefined(value)) {
      throw new Error('value should not be undefined');
    }

    return this.uintToHex(value ? 1 : 0);
  }

  /**
   * Converts an int to hex padded-left to 32 bytes.
   * Accepts the following formats:
   *    decimal: 12345
   *    string: '-12345'
   *    hex string (with 0x hex prefix): '0xbd614e' or 0xbd614e
   *    bignumber.js: <BigNumber: 3039>
   *    BN.js: <BN: 3039>
   * @param {number|string|BigNumber|BN} num The number to convert.
   * @return {string} The converted int to padded-left hex string.
   */
  static intToHex(num) {
    if (_.isUndefined(num)) {
      throw new Error('num should not be undefined');
    }

    return Web3Utils.toTwosComplement(num).slice(2);
  }

  /**
   * Converts a uint to hex padded-left to 32 bytes.
   * Accepts the following formats:
   *    decimal: 12345
   *    string: '12345'
   *    hex string (with 0x hex prefix): '0xbd614e' or 0xbd614e
   *    bignumber.js: <BigNumber: 3039>
   *    BN.js: <BN: 3039>
   * @param {number|string|BigNumber|BN} num The number to convert.
   * @return {string} The converted uint to padded-left hex string.
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

  /**
   * Converts a string into a hex string up to the max length.
   * @param {string} string The string to convert to hex.
   * @param {number} maxCharLen The total length of the hex string allowed.
   * @return {string} The converted string to single padded-right hex string.
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

  /**
   * Converts an array of string elements (max 32 bytes) into a concatenated hex string.
   * @param {Array} strArray The string array to convert to hex.
   * @param {number} numOfItems The total number of items the string array should have.
   * @return {string} The converted string array to single padded-right hex string.
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

  /**
   * Pads a hex string padded-left to 32 bytes.
   * @param {string} hexStr The hex string to pad.
   * @return {string} The padded-left hex string.
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

  /**
   * Encodes a parameter to hex based on its type.
   * @param {string} type The type of the value.
   * @param {any} value Value to convert to hex.
   * @return {string} The value converted to hex string.
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

  /**
   * Validates arguments by ABI schema and throws errors if mismatch.
   * @param {object} abi ABI of the contract.
   * @param {string} methodName The method name.
   * @param {array} methodArgs The method arguments.
   * @return {boolean} If valid methodName and methodArgs.
   */
  static validateMethodAndArgs(abi, methodName, args = []) {
    const methodObj = _.find(abi, { name: methodName });
    if (!abi) {
      throw Error('abi should not be undefined.');
    }
    if (!methodName) {
      throw Error('methodName should not be undefined.');
    }
    if (!methodObj) {
      throw Error(`Method ${methodName} not defined in ABI.`);
    }
    if (methodObj.inputs.length !== args.length) {
      throw Error('Number of arguments supplied does not match ABI method args.');
    }

    return true;
  }

  /**
   * Constructs the data hex string needed for a call() or send().
   * @param {object} abi ABI of the contract.
   * @param {string} methodObj Method name of the function.
   * @param {array} args Arguments for the method.
   * @return Hex string of all the encoded args.
   */
  static constructData(abi, methodName, args = []) {
    if (!this.validateMethodAndArgs(abi, methodName, args)) {
      throw Error('Invalid params to construct data.');
    }

    // Get the method obj from JSON
    const methodObj = _.find(abi, { name: methodName });
    if (!methodObj) {
      throw Error('Could not find method in ABI.');
    }

    // Get function hash
    const funcHash = this.objToHash(methodObj, true);

    // Create an array of data hex strings which will be combined at the end
    const numOfParams = methodObj.inputs.length;
    const dataHexArr = _.times(numOfParams, _.constant(null));

    // Calculate start byte for dynamic data
    let dataLoc = 0;
    _.each(methodObj.inputs, (item) => {
      const { type } = item;
      if (type.match(Constants.REGEX_STATIC_ARRAY)) {
        // treat each static array as an individual slot for dynamic data location purposes
        const arrCap = _.toNumber(type.match(Constants.REGEX_NUMBER)[1]);
        dataLoc += arrCap;
      } else {
        dataLoc += 1;
      }
    });

    _.each(methodObj.inputs, (item, index) => {
      const { type } = item;
      let hex;

      if (type === Constants.BYTES) {
        throw Error('dynamics bytes conversion not implemented.');
      } else if (type === Constants.STRING) {
        throw Error('dynamic string conversion not implemented.');
      } else if (type.match(Constants.REGEX_DYNAMIC_ARRAY)) { // dynamic types
        let data = '';

        // set location of dynamic data
        const startBytesLoc = dataLoc * 32;
        hex = this.uintToHex(startBytesLoc);
        dataHexArr[index] = hex;

        // construct data
        // add length of dynamic data set
        const numOfDynItems = args[index].length;
        data += this.uintToHex(numOfDynItems);

        // add each hex converted item
        _.each(args[index], (dynItem) => {
          data += this.encodeParam(type, dynItem);
        });

        // add the dynamic data to the end
        dataHexArr.push(data);

        // increment starting data location
        // +1 for the length of data set
        dataLoc += numOfDynItems + 1;
      } else if (type === Constants.ADDRESS
        || type === Constants.BOOL
        || type.match(Constants.REGEX_UINT)
        || type.match(Constants.REGEX_INT)
        || type.match(Constants.REGEX_BYTES)
        || type.match(Constants.REGEX_STATIC_ARRAY)) { // static types
        dataHexArr[index] = this.encodeParam(type, args[index]);
      } else {
        console.error(`Found unknown type: ${type}`);
      }
    });

    return funcHash + dataHexArr.join('');
  }
}

module.exports = Encoder;
