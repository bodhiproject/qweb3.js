import _ from 'lodash';
import EthjsAbi from 'ethjs-abi';
import Web3Utils from 'web3-utils';
import Utils from './utils';
import Decoder from './decoder';

class Formatter {

	/**
   * Formats the output of searchlog by decoding eventName, indexed and unindexed params
   * @param {object} rawOutput Raw seachlog output
   * @param {object} contractMetadata Metadata of all contracts and their events with topic hashes
   * @param {bool} removeHexPrefix Flag to indicate whether to remove the hex prefix (0x) from hex values
   * @return {object} Decoded searchlog output
   */
  static searchLogOutput(rawOutput, contractMetadata, removeHexPrefix) {
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

            // Strip hex prefix
            if (removeHexPrefix) {
              _.each(methodAbi.inputs, (inputItem) => {
                let value = decodedLog[inputItem.name];
                value = Decoder.removeHexPrefix(value);
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
  static callOutput(rawOutput, contractABI, methodName, removeHexPrefix) {
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

        // Strip hex prefix
        if (removeHexPrefix) {
          _.each(decodedOutput, (value, key) => {
            decodedOutput[key] = Decoder.removeHexPrefix(decodedOutput[key]);
          });
        }

        result = decodedOutput;
        return false;
      }
    });

    return result;
  }
}

module.exports = Formatter;
