const _ = require('lodash');
const EthjsAbi = require('ethjs-abi');
const Utils = require('./utils');

class Formatter {

	/**
	 * Formats the output of searchlog by decoding eventName, indexed and unindexed params
	 * @param  {object} rawOutput   Raw seachlog output
	 * @param  {object} contractABI
	 * @return {object}             Decoded searchlog output
	 */
  static searchLogOutput(rawOutput, contractABI) {

    if (_.isUndefined(contractABI)) {
      throw new Error(`contractABI is undefined.`);
    }

    // logDecoder is function created by EthjsAbi with ABI object
    const logDecoder = EthjsAbi.logDecoder(contractABI);

    return _.map(rawOutput, (resultEntry) => {

      let formatted = _.assign({}, resultEntry);

      // TODO: Format general fields of searchlogs

      // Format 'log' field of searchlogs
      // Each field of log needs to appended with '0x' to be parsed
      if (!_.isEmpty(resultEntry.log)) {

        const rawlogs = _.map(resultEntry.log, (logEntry) => ({
          address: Utils.formatHexStr(logEntry.address),
          data: Utils.formatHexStr(logEntry.data),
          topics: _.map(logEntry.topics, Utils.formatHexStr)
        }));

        formatted.log = logDecoder(rawlogs);
      }

      return formatted;
    });
  };

  static executionResultOutput(rawOutput, contractABI, methodName){
    if (_.isUndefined(contractABI)) {
      throw new Error(`contractABI is undefined.`);
    }

    if (_.isUndefined(methodName)) {
      throw new Error(`methodName is undefined.`);
    }

    const methodABI = _.filter(contractABI, {'name': methodName});

    var result = null;

    _.each(rawOutput, (index, item) => {
      if(item === 'executionResult'){
        let resultEntry = rawOutput[item];
        var decodedOutput = EthjsAbi.decodeMethod(methodABI[0], Utils.formatHexStr(resultEntry.output));
        result = decodedOutput;
        return false;
      }
    });

    return result;
  };
}

module.exports = Formatter;