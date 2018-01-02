'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bignumber = require('bignumber.js');

var _bignumber2 = _interopRequireDefault(_bignumber);

var _utf = require('utf8');

var _utf2 = _interopRequireDefault(_utf);

var _web3Utils = require('web3-utils');

var _web3Utils2 = _interopRequireDefault(_web3Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Should be called to get utf8 from it's hex representation
 *
 * @method toUtf8
 * @param {String} string in hex
 * @returns {String} ascii string representation of hex value
 */
var toUtf8 = function toUtf8(hex) {
  // Find termination
  var str = "";
  var i = 0,
      l = hex.length;
  if (hex.substring(0, 2) === '0x') {
    i = 2;
  }
  for (; i < l; i += 2) {
    var code = parseInt(hex.substr(i, 2), 16);
    if (code === 0) break;
    str += String.fromCharCode(code);
  }

  return _utf2.default.decode(str);
};

/**
 * Should be called to get hex representation (prefixed by 0x) of utf8 string
 *
 * @method fromUtf8
 * @param {String} string
 * @param {Number} optional padding
 * @returns {String} hex representation of input string
 */
var fromUtf8 = function fromUtf8(str) {
  str = _utf2.default.encode(str);
  var hex = "";
  for (var i = 0; i < str.length; i++) {
    var code = str.charCodeAt(i);
    if (code === 0) break;
    var n = code.toString(16);
    hex += n.length < 2 ? '0' + n : n;
  }

  return "0x" + hex;
};

/**
 * Should be called to get hex representation (prefixed by 0x) of ascii string
 *
 * @method fromAscii
 * @param {String} string
 * @param {Number} optional padding
 * @returns {String} hex representation of input string
 */
var fromAscii = function fromAscii(str) {
  var hex = "";
  for (var i = 0; i < str.length; i++) {
    var code = str.charCodeAt(i);
    var n = code.toString(16);
    hex += n.length < 2 ? '0' + n : n;
  }

  return "0x" + hex;
};

/**
 * Converts value to it's hex representation
 *
 * @method fromDecimal
 * @param {String|Number|BigNumber}
 * @return {String}
 */
var fromDecimal = function fromDecimal(value) {
  var number = toBigNumber(value);
  var result = number.toString(16);

  return number.lessThan(0) ? '-0x' + result.substr(1) : '0x' + result;
};

/**
 * Takes an input and transforms it into an bignumber
 *
 * @method toBigNumber
 * @param {Number|String|BigNumber} a number, string, HEX string or BigNumber
 * @return {BigNumber} BigNumber
 */
var toBigNumber = function toBigNumber(number) {
  /*jshint maxcomplexity:5 */
  number = number || 0;
  if (isBigNumber(number)) return number;

  if (isString(number) && (number.indexOf('0x') === 0 || number.indexOf('-0x') === 0)) {
    return new _bignumber2.default(number.replace('0x', ''), 16);
  }

  return new _bignumber2.default(number.toString(10), 10);
};

/**
 * Returns true if object is BigNumber, otherwise false
 *
 * @method isBigNumber
 * @param {Object}
 * @return {Boolean}
 */
var isBigNumber = function isBigNumber(object) {
  return object instanceof _bignumber2.default || object && object.constructor && object.constructor.name === 'BigNumber';
};

/**
 * Returns true if object is string, otherwise false
 *
 * @method isString
 * @param {Object}
 * @return {Boolean}
 */
var isString = function isString(object) {
  return typeof object === 'string' || object && object.constructor && object.constructor.name === 'String';
};

/**
 * Returns true if object is Objet, otherwise false
 *
 * @method isObject
 * @param {Object}
 * @return {Boolean}
 */
var isObject = function isObject(object) {
  return object !== null && !Array.isArray(object) && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object';
};

/**
 * Returns true if object is boolean, otherwise false
 *
 * @method isBoolean
 * @param {Object}
 * @return {Boolean}
 */
var isBoolean = function isBoolean(object) {
  return typeof object === 'boolean';
};

/**
 * Returns true if object is array, otherwise false
 *
 * @method isArray
 * @param {Object}
 * @return {Boolean}
 */
var isArray = function isArray(object) {
  return Array.isArray(object);
};

/**
 * Returns true if given string is valid json object
 *
 * @method isJson
 * @param {String}
 * @return {Boolean}
 */
var isJson = function isJson(str) {
  try {
    return !!JSON.parse(str);
  } catch (e) {
    return false;
  }
};

/**
 * Returns true if given string is a valid log topic.
 *
 * @method isTopic
 * @param {String} hex encoded topic
 * @return {Boolean}
 */
var isTopic = function isTopic(topic) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(topic)) {
    return false;
  } else if (/^(0x)?[0-9a-f]{64}$/.test(topic) || /^(0x)?[0-9A-F]{64}$/.test(topic)) {
    return true;
  }
  return false;
};

/**
 * Parameter check at the beginning of a function
 * Throw errors if required keys are missing in params object
 * @param  {string} methodName Function name used for error message
 * @param  {object} params     params object
 * @param  {array} required    Array of key strings in params, e.g. ['resultNames', 'sender']
 * @param  {func} validators  Custom functions used to validate params
 * @return {}
 */
function paramsCheck(methodName, params, required, validators) {
  if (_lodash2.default.isUndefined(params)) {
    throw new Error('params is undefined in params of ' + methodName + '; expected: ' + (_lodash2.default.isEmpty(required) ? undefined : required.join(',')));
  }

  if (required) {
    if (_lodash2.default.isArray(required)) {
      _lodash2.default.each(required, function (value) {
        if (_lodash2.default.isUndefined(params[value])) {
          throw new Error(value + ' is undefined in params of ' + methodName);
        }
      });
    } else if (_lodash2.default.isUndefined(params[required])) {
      throw new Error(required + ' is undefined in params of ' + methodName);
    }
  }

  if (!_lodash2.default.isEmpty(validators)) {
    _lodash2.default.each(validators, function (validFunc, key) {
      // Check whether each validator is a function
      if (typeof validFunc !== 'function') {
        throw new Error('validators are defined but not functions ...');
      }

      // Check whether key defined in validator is in params
      if (_lodash2.default.indexOf(params, key) < 0) {
        throw new Error(key + ' in validator is not found in params.');
      }

      // Run validator funcs and check result
      // If result === 'undefined', pass; otherwise throw error with message
      var error = validFunc(params[key], key);
      if (error instanceof Error) {
        throw new Error('validation for ' + key + ' failed; message:' + error.message);
      }
    });
  }
}

/**
 * Auto converts any given value into it's hex representation.
 *
 * And even stringifys objects before.
 *
 * @method toHex
 * @param {String|Number|BigNumber|Object}
 * @return {String}
 */
function toHex(val) {
  /*jshint maxcomplexity: 8 */

  if (_lodash2.default.isBoolean(val)) return fromDecimal(+val);

  if (isBigNumber(val)) return fromDecimal(val);

  if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') return fromUtf8(JSON.stringify(val));

  // if its a negative number, pass it through fromDecimal
  if (isString(val)) {
    if (val.indexOf('-0x') === 0) return fromDecimal(val);else if (val.indexOf('0x') === 0) return val;else if (!isFinite(val)) return fromAscii(val);
  }

  return fromDecimal(val);
};

/**
 * Validate format string and append '0x' to it if there's not one.
 * @param  {string} value  Hex string to format
 * @return {string}
 */
function formatHexStr(value) {
  // TODO: validate format of hex string
  if (_lodash2.default.startsWith(value, '0x')) {
    return value;
  } else {
    return "0x" + value;
  }
}

/**
 * Should be called to get ascii from it's hex representation
 *
 * @method toAscii
 * @param {String} string in hex
 * @returns {String} ascii string representation of hex value
 */
function toAscii(hex) {
  // Find termination
  var str = "";
  var i = 0,
      l = hex.length;
  if (hex.substring(0, 2) === '0x') {
    i = 2;
  }
  for (; i < l; i += 2) {
    var code = parseInt(hex.substr(i, 2), 16);
    str += String.fromCharCode(code);
  }

  return str;
};

/*
* Removes the '0x' hex prefix if necessary.
* @param str The string to remove the prefix from.
* @return The str without the hex prefix.
*/
function trimHexPrefix(str) {
  if (str && str.indexOf('0x') === 0) {
    return str.slice(2);
  } else {
    return str;
  }
}

/*
 * Breaks down a string by {length} and returns an array of string
 * @param {string} Input string
 * @param {number} Length of each chunk.
 * @return {array} broken-down string array
 */
function chunkString(str, length) {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
}

module.exports = {
  paramsCheck: paramsCheck,
  toHex: toHex,
  formatHexStr: formatHexStr,
  toUtf8: toUtf8,
  toAscii: toAscii,
  trimHexPrefix: trimHexPrefix,
  chunkString: chunkString
};