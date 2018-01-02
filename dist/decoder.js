'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _web3Utils = require('web3-utils');

var _web3Utils2 = _interopRequireDefault(_web3Utils);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _bs = require('bs58');

var _bs2 = _interopRequireDefault(_bs);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MainnetNetworkByte = '3A';
var TestnetNetworkByte = '78';

var Decoder = function () {
  function Decoder() {
    _classCallCheck(this, Decoder);
  }

  _createClass(Decoder, null, [{
    key: 'toQtumAddress',
    value: function toQtumAddress(hexAddress) {
      var isMainnet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (hexAddress === undefined || _lodash2.default.isEmpty(hexAddress)) {
        throw new Error('hexAddress should not be undefined or empty');
      }
      if (!_web3Utils2.default.isHex(hexAddress)) {
        throw new Error('Invalid hex address');
      }
      // reference: https://gobittest.appspot.com/Address
      var qAddress = hexAddress;
      // Add network byte
      if (isMainnet) {
        qAddress = MainnetNetworkByte + qAddress;
      } else {
        qAddress = TestnetNetworkByte + qAddress;
      }

      var qAddressBuffer = Buffer.from(qAddress, 'hex');
      // Double SHA256 hash
      var hash1 = _crypto2.default.createHash('sha256').update(qAddressBuffer).digest('Hex');
      var hash1Buffer = Buffer.from(hash1, 'hex');
      var hash2 = _crypto2.default.createHash('sha256').update(hash1Buffer).digest('Hex');

      // get first 4 bytes
      qAddress = qAddress + hash2.slice(0, 8);

      // base58 encode
      var address = _bs2.default.encode(Buffer.from(qAddress, 'hex'));
      return address;
    }
  }, {
    key: 'removeHexPrefix',
    value: function removeHexPrefix(value) {
      if (value === undefined) {
        return false;
      }

      if (value instanceof Array) {
        _lodash2.default.each(value, function (arrayItem, index) {
          if (_web3Utils2.default.isHex(arrayItem)) {
            value[index] = _utils2.default.trimHexPrefix(arrayItem);
          }
        });
      } else {
        if (_web3Utils2.default.isHex(value)) {
          value = _utils2.default.trimHexPrefix(value);
        }
      }

      return value;
    }
  }]);

  return Decoder;
}();

module.exports = Decoder;