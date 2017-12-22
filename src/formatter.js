const _ = require('lodash');
const EthjsAbi = require('ethjs-abi');
const Utils = require('./utils');

class Formatter {

	/**
   * Formats the output of searchlog by decoding eventName, indexed and unindexed params
   * @param  {object} rawOutput   Raw seachlog output
   * @return {object}             Decoded searchlog output
   */
  static searchLogOutput(rawOutput) {
    return _.map(rawOutput, (resultEntry) => {  
      let formatted = _.assign({}, resultEntry);

      if (!_.isEmpty(resultEntry.log)) {
        _.each(resultEntry.log, (item, index) => {
          const topicHash = item.topics[0];
          const eventTopicObj = _.find(EventTopics, { eventHash: topicHash });

          // Each field of log needs to appended with '0x' to be parsed
          item.address = Utils.formatHexStr(item.address);
          item.data = Utils.formatHexStr(item.data);
          item.topics = _.map(item.topics, Utils.formatHexStr);

          const methodAbi = _.find(eventTopicObj.abi, { name: eventTopicObj.name });
          resultEntry.log[index] = EthjsAbi.decodeLogItem(methodAbi, item);
        });
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

    console.log('rawOutput', rawOutput);

    const methodABI = _.filter(contractABI, {'name': methodName});
    var result = null;

    _.each(rawOutput, (index, item) => {
      if (item === 'executionResult') {
        let resultEntry = rawOutput[item];
        var decodedOutput = EthjsAbi.decodeMethod(methodABI[0], Utils.formatHexStr(resultEntry.output));
        console.log(decodedOutput);
        result = decodedOutput;
        return false;
      }
    });

    console.log('returning result', result);
    return result;
  };
}

module.exports = Formatter;
