'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utf = require('utf8');

var _utf2 = _interopRequireDefault(_utf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: 'paramsCheck',

    /**
     * Parameter check at the beginning of a function
     * Throw errors if required keys are missing in params object
     * @param  {string} methodName Function name used for error message
     * @param  {object} params     params object
     * @param  {array} required    Array of key strings in params, e.g. ['resultNames', 'sender']
     * @param  {func} validators  Custom functions used to validate params
     * @return {}
     */
    value: function paramsCheck(methodName, params, required, validators) {
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
     * Validate format string and append '0x' to it if there's not one.
     * @param  {string} value  Hex string to format
     * @return {string}
     */

  }, {
    key: 'appendHexPrefix',
    value: function appendHexPrefix(value) {
      if (_lodash2.default.startsWith(value, '0x')) {
        return value;
      }
      return '0x' + value;
    }

    /*
    * Removes the '0x' hex prefix if necessary.
    * @param str The string to remove the prefix from.
    * @return The str without the hex prefix.
    */

  }, {
    key: 'trimHexPrefix',
    value: function trimHexPrefix(str) {
      if (str && str.indexOf('0x') === 0) {
        return str.slice(2);
      }
      return str;
    }

    /*
     * Breaks down a string by {length} and returns an array of string
     * @param {string} Input string
     * @param {number} Length of each chunk.
     * @return {array} broken-down string array
     */

  }, {
    key: 'chunkString',
    value: function chunkString(str, length) {
      return str.match(new RegExp('.{1,' + length + '}', 'g'));
    }

    /**
     * Should be called to get utf8 from it's hex representation
     *
     * @method toUtf8
     * @param {String} string in hex
     * @returns {String} ascii string representation of hex value
     */

  }, {
    key: 'toUtf8',
    value: function toUtf8(hex) {
      // Find termination
      var str = '';
      var i = 0,
          l = hex.length;
      if (hex.substring(0, 2) === '0x') {
        i = 2;
      }
      for (; i < l; i += 2) {
        var code = parseInt(hex.substr(i, 2), 16);
        if (code === 0) {
          break;
        }
        str += String.fromCharCode(code);
      }

      return _utf2.default.decode(str);
    }

    /**
     * Should be called to get hex representation (prefixed by 0x) of utf8 string
     *
     * @method fromUtf8
     * @param {String} string
     * @param {Number} optional padding
     * @returns {String} hex representation of input string
     */

  }, {
    key: 'fromUtf8',
    value: function fromUtf8(str) {
      str = _utf2.default.encode(str);
      var hex = '';
      for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        if (code === 0) {
          break;
        }
        var n = code.toString(16);
        hex += n.length < 2 ? '0' + n : n;
      }

      return '0x' + hex;
    }

    /**
     * Returns true if given string is valid json object
     *
     * @method isJson
     * @param {String}
     * @return {Boolean}
     */

  }, {
    key: 'isJson',
    value: function isJson(str) {
      try {
        return !!JSON.parse(str);
      } catch (e) {
        return false;
      }
    }
  }]);

  return Utils;
}();

module.exports = Utils;