'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ethjsAbi = require('ethjs-abi');

var _ethjsAbi2 = _interopRequireDefault(_ethjsAbi);

var _web3Utils = require('web3-utils');

var _web3Utils2 = _interopRequireDefault(_web3Utils);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _encoder = require('./encoder');

var _encoder2 = _interopRequireDefault(_encoder);

var _decoder = require('./decoder');

var _decoder2 = _interopRequireDefault(_decoder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Formatter = function () {
  function Formatter() {
    _classCallCheck(this, Formatter);
  }

  _createClass(Formatter, null, [{
    key: 'searchLogOutput',

    /**
     * Formats the output of searchlog by decoding eventName, indexed and unindexed params
     * @param {object} rawOutput Raw seachlog output
     * @param {object} contractMetadata Metadata of all contracts and their events with topic hashes
     * @param {bool} removeHexPrefix Flag to indicate whether to remove the hex prefix (0x) from hex values
     * @return {object} Decoded searchlog output
     */
    value: function searchLogOutput(rawOutput, contractMetadata, removeHexPrefix) {
      // Create dict of all event hashes
      var eventHashes = {};
      _lodash2.default.each(contractMetadata, function (contractItem, contractKey) {
        var filteredEvents = _lodash2.default.filter(contractItem.abi, { type: 'event' });

        _lodash2.default.each(filteredEvents, function (eventObj) {
          var hash = _encoder2.default.getEventHash(eventObj);
          eventHashes[hash] = {
            contract: contractKey,
            event: eventObj.name
          };
        });
      });

      return _lodash2.default.map(rawOutput, function (resultEntry) {
        var formatted = _lodash2.default.assign({}, resultEntry);

        if (!_lodash2.default.isEmpty(resultEntry.log)) {
          _lodash2.default.each(resultEntry.log, function (item, index) {
            var eventHashObj = eventHashes[item.topics[0]];

            var contractObj = void 0;
            if (eventHashObj) {
              contractObj = contractMetadata[eventHashObj.contract];
            }

            if (contractObj) {
              // Each field of log needs to appended with '0x' to be parsed
              item.address = _utils2.default.appendHexPrefix(item.address);
              item.data = _utils2.default.appendHexPrefix(item.data);
              item.topics = _lodash2.default.map(item.topics, _utils2.default.appendHexPrefix);

              var methodAbi = _lodash2.default.find(contractObj.abi, { name: eventHashObj.event });
              if (_lodash2.default.isUndefined(methodAbi)) {
                console.warn('Error: Could not find method in ABI for ' + eventHashObj.event);
                return;
              }

              var decodedLog = void 0;
              try {
                decodedLog = _ethjsAbi2.default.decodeLogItem(methodAbi, item);
              } catch (err) {
                // catch throws in decodeLogItem
                console.warn(err.message);
                return;
              }

              // Strip hex prefix
              if (removeHexPrefix) {
                _lodash2.default.each(methodAbi.inputs, function (inputItem) {
                  var value = decodedLog[inputItem.name];
                  value = _decoder2.default.removeHexPrefix(value);
                  decodedLog[inputItem.name] = value;
                });
              }

              resultEntry.log[index] = decodedLog;
            }
          });
        }

        return formatted;
      });
    }

    /**
     * Formats the output of a callcontract call.
     * @param  {object} rawOutput Raw output of callcontract
     * @param  {object} contractABI The ABI of the contract that was called
     * @param  {string} methodName The name of the method that was called
     * @param   {bool} removeHexPrefix Flag to indicate whether to remove the hex prefix (0x) from hex values
     * @return {object} Decoded callcontract output
     */

  }, {
    key: 'callOutput',
    value: function callOutput(rawOutput, contractABI, methodName, removeHexPrefix) {
      if (_lodash2.default.isUndefined(contractABI)) {
        throw new Error('contractABI is undefined.');
      }
      if (_lodash2.default.isUndefined(methodName)) {
        throw new Error('methodName is undefined.');
      }

      var methodABI = _lodash2.default.filter(contractABI, { name: methodName });
      var result = null;

      _lodash2.default.each(rawOutput, function (value, key) {
        if (key === 'executionResult') {
          var resultObj = rawOutput[key];
          var decodedOutput = _ethjsAbi2.default.decodeMethod(methodABI[0], _utils2.default.appendHexPrefix(resultObj.output));

          // Strip hex prefix
          if (removeHexPrefix) {
            _lodash2.default.each(decodedOutput, function (value, key) {
              decodedOutput[key] = _decoder2.default.removeHexPrefix(decodedOutput[key]);
            });
          }

          result = decodedOutput;
          return false;
        }
      });

      return result;
    }
  }]);

  return Formatter;
}();

module.exports = Formatter;