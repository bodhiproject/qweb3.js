const { isEmpty, isUndefined, each, find, filter, assign, map } = require('lodash');
const Web3Utils = require('web3-utils');
const EthjsAbi = require('ethjs-abi');
const crypto = require('crypto');
const bs58 = require('bs58');

const Encoder = require('./encoder');
const Utils = require('../utils');

const MainnetNetworkByte = '3A';
const TestnetNetworkByte = '78';

class Decoder {
  static toQtumAddress(hexAddress, isMainnet = false) {
    if (hexAddress === undefined || isEmpty(hexAddress)) {
      throw new Error('hexAddress should not be undefined or empty');
    }
    if (!Web3Utils.isHex(hexAddress)) {
      throw new Error('Invalid hex address');
    }
    // reference: https://gobittest.appspot.com/Address
    let qAddress = hexAddress;
    // Add network byte
    if (isMainnet) {
      qAddress = MainnetNetworkByte + qAddress;
    } else {
      qAddress = TestnetNetworkByte + qAddress;
    }

    const qAddressBuffer = Buffer.from(qAddress, 'hex');
    // Double SHA256 hash
    const hash1 = crypto.createHash('sha256').update(qAddressBuffer).digest('Hex');
    const hash1Buffer = Buffer.from(hash1, 'hex');
    const hash2 = crypto.createHash('sha256').update(hash1Buffer).digest('Hex');

    // get first 4 bytes
    qAddress += hash2.slice(0, 8);

    // base58 encode
    const address = bs58.encode(Buffer.from(qAddress, 'hex'));
    return address;
  }

  static removeHexPrefix(value) {
    if (value === undefined) {
      return false;
    }

    let v = value;
    if (v instanceof Array) {
      each(v, (arrayItem, index) => {
        if (Web3Utils.isHex(arrayItem)) {
          v[index] = Utils.trimHexPrefix(arrayItem);
        }
      });
    } else if (Web3Utils.isHex(value)) {
      v = Utils.trimHexPrefix(value);
    }

    return v;
  }

  /**
   * Formats the output of searchlog by decoding eventName, indexed, and unindexed params
   * @param {object} rawOutput Raw seachlog output
   * @param {object} contractMetadata Metadata of all contracts and their events with topic hashes
   * @param {bool} removeHexPrefix Flag to indicate whether to remove the hex prefix (0x) from hex values
   * @return {object} Decoded searchlog output
   */
  static decodeSearchLog(rawOutput, contractMetadata, removeHexPrefix = true) {
    // Create dict of all event hashes
    const eventHashes = {};
    each(contractMetadata, (contractItem, contractKey) => {
      const filteredEvents = filter(contractItem.abi, { type: 'event' });

      each(filteredEvents, (eventObj) => {
        const hash = Encoder.objToHash(eventObj, false);
        eventHashes[hash] = {
          contract: contractKey,
          event: eventObj.name,
        };
      });
    });

    return map(rawOutput, (resultEntry) => {
      const formatted = assign({}, resultEntry);

      if (!isEmpty(resultEntry.log)) {
        each(resultEntry.log, (item, index) => {
          const eventHashObj = eventHashes[item.topics[0]];

          let contractObj;
          if (eventHashObj) {
            contractObj = contractMetadata[eventHashObj.contract];
          }

          if (contractObj) {
            // Each field of log needs to appended with '0x' to be parsed
            Object.assign(item, {
              address: Utils.appendHexPrefix(item.address),
              data: Utils.appendHexPrefix(item.data),
              topics: map(item.topics, Utils.appendHexPrefix),
            });

            const methodAbi = find(contractObj.abi, { name: eventHashObj.event });
            if (isUndefined(methodAbi)) {
              console.warn(`Error: Could not find method in ABI for ${eventHashObj.event}`);
              return;
            }

            let decodedLog;
            try {
              decodedLog = EthjsAbi.decodeLogItem(methodAbi, item);
            } catch (err) { // catch throws in decodeLogItem
              console.warn(err.message);
              return;
            }

            // Strip hex prefix
            if (removeHexPrefix) {
              each(methodAbi.inputs, (inputItem) => {
                let value = decodedLog[inputItem.name];
                value = Decoder.removeHexPrefix(value);
                decodedLog[inputItem.name] = value;
              });
            }

            resultEntry.log.splice(index, 1, decodedLog);
          }
        });
      }

      return formatted;
    });
  }

  /**
   * Decodes the output of a callcontract and puts it in executionResult.formattedOutput
   * @param {object} rawOutput Raw output of callcontract.
   * @param {object} contractABI The ABI of the contract that was called.
   * @param {string} methodName The name of the method that was called.
   * @param {bool} removeHexPrefix Flag to indicate whether to remove the hex prefix (0x) from hex values.
   * @return {object} Decoded callcontract output.
   */
  static decodeCall(rawOutput, contractABI, methodName, removeHexPrefix = true) {
    if (!rawOutput) {
      throw Error('rawOutput is undefined.');
    }
    if (!contractABI) {
      throw Error('contractABI is undefined.');
    }
    if (!methodName) {
      throw Error('methodName is undefined.');
    }

    const output = rawOutput;
    const methodABI = find(contractABI, { name: methodName });
    if (methodABI && 'executionResult' in output && 'output' in output.executionResult) {
      const formattedOutput = EthjsAbi.decodeMethod(
        methodABI,
        Utils.appendHexPrefix(output.executionResult.output),
      );

      if (removeHexPrefix) {
        each(Object.keys(formattedOutput), (key) => {
          formattedOutput[key] = Decoder.removeHexPrefix(formattedOutput[key]);
        });
      }
      output.executionResult.formattedOutput = formattedOutput;
    }
    return output;
  }
}

module.exports = Decoder;
