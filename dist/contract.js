'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _httpprovider = require('./httpprovider');

var _httpprovider2 = _interopRequireDefault(_httpprovider);

var _formatter = require('./formatter');

var _formatter2 = _interopRequireDefault(_formatter);

var _utils = require('./utils.js');

var _utils2 = _interopRequireDefault(_utils);

var _encoder = require('./encoder');

var _encoder2 = _interopRequireDefault(_encoder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SEND_AMOUNT = 0;
var SEND_GASLIMIT = 250000;
var SEND_GASPRICE = 0.0000004;

var MAX_BYTES_PER_ARRAY_SLOT = 64;

var REGEX_UINT = /^uint/;
var REGEX_INT = /^int/;
var REGEX_BYTES = /bytes([1-9]|[12]\d|3[0-2])$/;
var REGEX_BYTES_ARRAY = /bytes([1-9]|[12]\d|3[0-2])(\[[0-9]+\])$/;
var REGEX_NUMBER = /[0-9]+/g;
var REGEX_DYNAMIC_ARRAY = /\[\]/;

var Contract = function () {
  function Contract(url, address, abi) {
    _classCallCheck(this, Contract);

    this.provider = new _httpprovider2.default(url);
    this.address = _utils2.default.trimHexPrefix(address);
    this.abi = abi;
  }

  /**
   * @dev Executes a callcontract on a view/pure method via the qtum-cli.
   * @param {string} methodName Name of contract method
   * @param {array} params Parameters of contract method
   * @return {Promise} Promise containing result object or Error
   */


  _createClass(Contract, [{
    key: 'call',
    value: function call(methodName, params) {
      var _this = this;

      var methodArgs = params.methodArgs,
          senderAddress = params.senderAddress;

      var _validateMethodAndArg = this.validateMethodAndArgs(methodName, methodArgs),
          methodObj = _validateMethodAndArg.method,
          args = _validateMethodAndArg.args;

      var options = {
        method: 'callcontract',
        params: [this.address, this.constructDataHex(methodObj, args), senderAddress]
      };

      return this.provider.request(options).then(function (result) {
        return _formatter2.default.callOutput(result, _this.abi, methodName, true);
      });
    }

    /*
    * @dev Executes a sendtocontract on this contract via the qtum-cli.
    * @param methodName Method name to execute as a string.
    * @param params Parameters of the contract method.
    * @return The transaction id of the sendtocontract.
    */

  }, {
    key: 'send',
    value: function send(methodName, params) {
      // Throw if methodArgs or senderAddress is not defined in params
      _utils2.default.paramsCheck('send', params, ['methodArgs', 'senderAddress']);

      var methodArgs = params.methodArgs,
          amount = params.amount,
          gasLimit = params.gasLimit,
          gasPrice = params.gasPrice,
          senderAddress = params.senderAddress;

      var _validateMethodAndArg2 = this.validateMethodAndArgs(methodName, methodArgs),
          methodObj = _validateMethodAndArg2.method,
          args = _validateMethodAndArg2.args;

      var options = {
        method: 'sendtocontract',
        params: [this.address, this.constructDataHex(methodObj, args), amount || SEND_AMOUNT, gasLimit || SEND_GASLIMIT, gasPrice || SEND_GASPRICE, senderAddress]
      };

      return this.provider.request(options);
    }

    /*
    * @dev Constructs the data hex string needed for a call() or send().
    * @param methodObj The json object of the method taken from the ABI.
    * @param args The arguments for the method.
    * @return The full hex string concatenated together.
    */

  }, {
    key: 'constructDataHex',
    value: function constructDataHex(methodObj, args) {
      if (!methodObj) {
        throw new Error('methodObj should not be undefined.');
      }

      var dataHex = '';
      dataHex = dataHex.concat(_encoder2.default.getFunctionHash(methodObj));

      var hex = void 0;
      _lodash2.default.each(methodObj.inputs, function (item, index) {
        var type = item.type;

        if (type === 'address') {
          hex = _encoder2.default.addressToHex(args[index]);
          dataHex = dataHex.concat(hex);
        } else if (type === 'bool') {
          hex = _encoder2.default.boolToHex(args[index]);
          dataHex = dataHex.concat(hex);
        } else if (type.match(REGEX_UINT)) {
          hex = _encoder2.default.uintToHex(args[index]);
          dataHex = dataHex.concat(hex);
        } else if (type.match(REGEX_INT)) {
          hex = _encoder2.default.intToHex(args[index]);
          dataHex = dataHex.concat(hex);
        } else if (type.match(REGEX_BYTES_ARRAY)) {
          // fixed bytes array, ie. bytes32[10]
          var arrCapacity = _lodash2.default.toNumber(type.match(REGEX_NUMBER)[1]);
          if (args[index] instanceof Array) {
            hex = _encoder2.default.stringArrayToHex(args[index], arrCapacity);
            dataHex = dataHex.concat(hex);
          } else {
            hex = _encoder2.default.stringToHex(args[index], MAX_BYTES_PER_ARRAY_SLOT * arrCapacity);
            dataHex = dataHex.concat(hex);
          }
        } else if (type.match(REGEX_BYTES)) {
          // fixed bytes, ie. bytes32
          hex = _encoder2.default.stringToHex(args[index], MAX_BYTES_PER_ARRAY_SLOT);
          dataHex = dataHex.concat(hex);
        } else if (type === 'bytes') {
          console.error('dynamics bytes conversion not implemented.');
        } else if (type === 'string') {
          console.error('dynamic string conversion not implemented.');
        } else if (type.match(REGEX_DYNAMIC_ARRAY)) {
          console.error('dynamic array conversion not implemented.');
        } else {
          console.error('found unknown type: ' + type);
        }
      });

      return dataHex;
    }

    /**
     * Validates arguments by ABI schema and throws errors if mismatch.
     * @param {String} methodName The method name.
     * @param {Array} methodArgs The method arguments.
     * @return {Object} The method object in ABI and processed argument array.
     */

  }, {
    key: 'validateMethodAndArgs',
    value: function validateMethodAndArgs(methodName, methodArgs) {
      var methodObj = _lodash2.default.find(this.abi, { name: methodName });

      if (_lodash2.default.isUndefined(methodObj)) {
        throw new Error('Method ' + methodName + ' not defined in ABI.');
      }
      if (methodObj.inputs.length != methodArgs.length) {
        throw new Error('Number of arguments supplied does not match ABI method args.');
      }

      var args = void 0;
      if (_lodash2.default.isUndefined(methodArgs)) {
        args = [];
      } else if (_lodash2.default.isArray(methodArgs)) {
        args = methodArgs;
      } else {
        args = [methodArgs];
      }

      return {
        method: methodObj,
        args: args
      };
    }
  }]);

  return Contract;
}();

module.exports = Contract;