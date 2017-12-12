const _ = require('lodash');
const EthjsAbi = require('ethjs-abi');
const utils = require('./utils');

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
          address: utils.formatHexStr(logEntry.address),
          data: utils.formatHexStr(logEntry.data),
          topics: _.map(logEntry.topics, utils.formatHexStr)
        }));

        formatted.log = logDecoder(rawlogs);
      }

      return formatted;
    });
  };

}

module.exports = Formatter;