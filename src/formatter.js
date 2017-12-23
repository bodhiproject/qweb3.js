const _ = require('lodash');
const EthjsAbi = require('ethjs-abi');
const Utils = require('./utils');
const EventMetadata = require('./event_metadata');

class Formatter {

	/**
   * Formats the output of searchlog by decoding eventName, indexed and unindexed params
   * @param {object} rawOutput Raw seachlog output
   * @param {object} contractMetadata Metadata of all contracts and their events with topic hashes
   * @return {object} Decoded searchlog output
   */
  static searchLogOutput(rawOutput, contractMetadata) {
    return _.map(rawOutput, (resultEntry) => {  
      let formatted = _.assign({}, resultEntry);

      if (!_.isEmpty(resultEntry.log)) {
        _.each(resultEntry.log, (item, index) => {
          const eventHash = item.topics[0];

          let eventName;
          let metadataObj;
          _.each(contractMetadata, (contractItem, index) => {
            eventName = (_.invert(contractItem))[eventHash]; 

            if (eventName) {
              metadataObj = contractItem;
              return false;
            }
          });

          if (metadataObj) {
            // Each field of log needs to appended with '0x' to be parsed
            item.address = Utils.formatHexStr(item.address);
            item.data = Utils.formatHexStr(item.data);
            item.topics = _.map(item.topics, Utils.formatHexStr);

            const methodAbi = _.find(metadataObj.abi, { name: eventName });
            let decodedLog;
            try {
              decodedLog = EthjsAbi.decodeLogItem(methodAbi, item);
            } catch(err) { // catch throws in decodeLogItem
              console.warn(err.message);
              return;
            }

            // Strip out hex prefix for addresses
            _.each(methodAbi.inputs, (inputItem) => {
              if (inputItem.type === 'address') {
                decodedLog[inputItem.name] = Utils.trimHexPrefix(decodedLog[inputItem.name]);
              }
            });

            resultEntry.log[index] = decodedLog;
          } else {
            console.warn(`could not find event with topic hash: ${eventHash}`);
          }
        });
      }

      return formatted;
    });
  };

  /**
   * Formats the output of a callcontract call.
   * @param  {object} rawOutput Raw output of callcontract
   * @param  {object} contractABI The ABI of the contract that was called
   * @param  {string} methodName The name of the method that was called
   * @return {object} Decoded callcontract output
   */
  static callOutput(rawOutput, contractABI, methodName) {
    if (_.isUndefined(contractABI)) {
      throw new Error(`contractABI is undefined.`);
    }
    if (_.isUndefined(methodName)) {
      throw new Error(`methodName is undefined.`);
    }

    const methodABI = _.filter(contractABI, {'name': methodName});
    let result = null;

    _.each(rawOutput, (value, key) => {
      if (key === 'executionResult') {
        const resultObj = rawOutput[key];
        const decodedOutput = EthjsAbi.decodeMethod(methodABI[0], Utils.formatHexStr(resultObj.output));

        // Strip out hex prefix for addresses
        _.each(methodABI.inputs, (inputItem, index) => {
          if (inputItem.type === 'address') {
            decodedOutput[index.toString()] = Utils.trimHexPrefix(decodedOutput[index.toString()]);
          }
        });

        result = decodedOutput;
        return false;
      }
    });

    return result;
  };
}

module.exports = Formatter;
