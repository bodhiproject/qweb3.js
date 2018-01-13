'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _web3Utils = require('web3-utils');

var _web3Utils2 = _interopRequireDefault(_web3Utils);

var _bignumber = require('bignumber.js');

var _bignumber2 = _interopRequireDefault(_bignumber);

var _bs = require('bs58');

var _bs2 = _interopRequireDefault(_bs);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PADDED_BYTES = 64;

var Encoder = function () {
  function Encoder() {
    _classCallCheck(this, Encoder);
  }

  _createClass(Encoder, null, [{
    key: 'getFunctionHash',

    /*
     * Converts an object of a method from the ABI to a function hash.
     * @param methodObj The json object of the method taken from the ABI.
     * @return The function hash.
     */
    value: function getFunctionHash(methodObj) {
      if (!methodObj) {
        throw new Error('methodObj should not be undefined');
      }

      var name = methodObj.name;
      var params = '';
      for (var i = 0; i < methodObj.inputs.length; i++) {
        params = params.concat(methodObj.inputs[i].type);

        if (i < methodObj.inputs.length - 1) {
          params = params.concat(',');
        }
      }
      var signature = name.concat('(').concat(params).concat(')');

      // Return only the first 4 bytes
      return _web3Utils2.default.sha3(signature).slice(2, 10);
    }

    /*
     * Converts a Qtum or hex address to a padded hex string.
     * @param address The Qtum/hex address to convert.
     * @return The 32 bytes padded-left hex string.
     */

  }, {
    key: 'addressToHex',
    value: function addressToHex(address) {
      if (!address) {
        throw new Error('address should not be undefined');
      }

      // Remove '0x' from beginning of address
      var addr = _utils2.default.trimHexPrefix(address);

      var hexAddr = void 0;
      if (_web3Utils2.default.isHex(addr)) {
        hexAddr = addr;
      } else {
        var bytes = _bs2.default.decode(addr);
        hexAddr = bytes.toString('hex');
        hexAddr = hexAddr.slice(2, 42); // Removes first byte (version) & last 4 bytes (checksum)
      }

      return _web3Utils2.default.padLeft(hexAddr, PADDED_BYTES);
    }

    /*
     * Converts a boolean to hex padded-left to 32 bytes. Accepts it in true/false or 1/0 format.
     * @param value The boolean to convert.
     * @return The converted boolean to padded-left hex string.
     */

  }, {
    key: 'boolToHex',
    value: function boolToHex(value) {
      if (_lodash2.default.isUndefined(value)) {
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

  }, {
    key: 'intToHex',
    value: function intToHex(num) {
      if (_lodash2.default.isUndefined(num)) {
        throw new Error('num should not be undefined');
      }

      return _web3Utils2.default.toTwosComplement(num).slice(2);
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

  }, {
    key: 'uintToHex',
    value: function uintToHex(num) {
      if (_lodash2.default.isUndefined(num)) {
        throw new Error('num should not be undefined');
      }

      var bigNum = void 0;
      if (_web3Utils2.default.isHexStrict(num)) {
        bigNum = new _bignumber2.default(num, 16);
      } else {
        bigNum = new _bignumber2.default(num, 10);
      }

      var hexNum = _web3Utils2.default.numberToHex(bigNum);
      return _web3Utils2.default.padLeft(hexNum, PADDED_BYTES).slice(2);
    }

    /*
     * Converts a string into a hex string up to the max length.
     * @param {string} string The string to convert to hex.
     * @param {number} maxCharLen The total length of the hex string allowed.
     * @return The converted string to single padded-right hex string.
     */

  }, {
    key: 'stringToHex',
    value: function stringToHex(string, maxCharLen) {
      if (!_lodash2.default.isString(string)) {
        throw new Error('string should be a String');
      }
      if (!_lodash2.default.isNumber(maxCharLen)) {
        throw new Error('maxCharLen should be a Number');
      }

      var hexString = _web3Utils2.default.utf8ToHex(string);
      hexString = _web3Utils2.default.padRight(hexString, maxCharLen).slice(2, maxCharLen + 2);

      return hexString;
    }

    /*
     * Converts an array of string elements (max 32 bytes) into a concatenated hex string.
     * @param strArray The string array to convert to hex.
     * @param numOfItems The total number of items the string array should have.
     * @return The converted string array to single padded-right hex string.
     */

  }, {
    key: 'stringArrayToHex',
    value: function stringArrayToHex(strArray, numOfItems) {
      if (!Array.isArray(strArray)) {
        throw new Error('strArray is not an Array');
      }
      if (!_lodash2.default.isNumber(numOfItems)) {
        throw new Error('numOfItems is not a Number');
      }
      if (numOfItems <= 0) {
        throw new Error('numOfItems should be greater than 0');
      }

      var array = new Array(10);
      for (var i = 0; i < numOfItems; i++) {
        var hexString = void 0;
        if (strArray[i] != undefined) {
          hexString = _web3Utils2.default.utf8ToHex(strArray[i].toString());
        } else {
          hexString = _web3Utils2.default.utf8ToHex('');
        }

        // Remove the 0x hex prefix
        array[i] = _web3Utils2.default.padRight(hexString, PADDED_BYTES).slice(2, PADDED_BYTES + 2);
      }

      return array.join('');
    }

    /*
     * Pads a hex string padded-left to 32 bytes.
     * @param {String} hexStr The hex string to pad.
     * @return {String} The padded-left hex string.
     */

  }, {
    key: 'padHexString',
    value: function padHexString(hexStr) {
      if (_lodash2.default.isUndefined(hexStr)) {
        throw new Error('hexStr should not be undefined');
      }
      if (!_web3Utils2.default.isHex(hexStr)) {
        throw new TypeError('hexStr should be a hex string');
      }

      var trimmed = _utils2.default.trimHexPrefix(hexStr);
      return _web3Utils2.default.padLeft(trimmed, PADDED_BYTES);
    }
  }]);

  return Encoder;
}();

module.exports = Encoder;