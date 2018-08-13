const _ = require('lodash');
const EthjsAbi = require('ethjs-abi');

const Utils = require('../utils');
const Decoder = require('./decoder');

class Formatter {
  /**
   * Formats the output of a callcontract call.
   * @param  {object} rawOutput Raw output of callcontract
   * @param  {object} contractABI The ABI of the contract that was called
   * @param  {string} methodName The name of the method that was called
   * @param   {bool} removeHexPrefix Flag to indicate whether to remove the hex prefix (0x) from hex values
   * @return {object} Decoded callcontract output
   */
  static callOutput(rawOutput, contractABI, methodName, removeHexPrefix) {
    if (_.isUndefined(contractABI)) {
      throw new Error('contractABI is undefined.');
    }
    if (_.isUndefined(methodName)) {
      throw new Error('methodName is undefined.');
    }

    const methodABI = _.filter(contractABI, { name: methodName });
    let result = null;

    _.each(rawOutput, (value, key) => {
      if (key === 'executionResult') {
        const resultObj = rawOutput[key];
        const decodedOutput = EthjsAbi.decodeMethod(methodABI[0], Utils.appendHexPrefix(resultObj.output));

        // Strip hex prefix
        if (removeHexPrefix) {
          _.each(decodedOutput, (value2, key2) => {
            decodedOutput[key2] = Decoder.removeHexPrefix(decodedOutput[key2]);
          });
        }

        result = decodedOutput;
        return false;
      }
      return true;
    });

    return result;
  }
}

module.exports = Formatter;
