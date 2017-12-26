const Web3Utils = require('web3-utils');
const Utils = require('./utils');

class Encoder {

  /*
   * Converts a string into a hex string up to the max length.
   * @param {string} string The string to convert to hex.
   * @param {number} maxCharLen The total length of the hex string allowed.
   * @return The converted string to single padded-right hex string.
   */
  function stringToHex(string, maxCharLen) {
    if (string === undefined) {
      throw new Error(`string should not be undefined`);
    }

    let hexString = Web3Utils.toHex(string).slice(2);
    hexString = Web3Utils.padRight(hexString, maxCharLen).slice(0, maxCharLen);

    return hexString;
  }

  /*
   * Converts an array of string elements (max 32 bytes) into a concatenated hex string.
   * @param strArray The string array to convert to hex.
   * @param numOfItems The total number of items the string array should have.
   * @return The converted string array to single padded-right hex string.
   */
  function stringArrayToHex(strArray, numOfItems) {
    if (!Array.isArray(strArray)) {
      throw new Error(`strArray is not an array type.`);
    }
    if (numOfItems <= 0) {
      throw new Error(`numOfItems should be greater than 0.`);
    }

    let chars = numOfChars(32);
    let array = new Array(10);
    for (let i = 0; i < numOfItems; i++) {
      let hexString;
      if (strArray[i] != undefined) {
        hexString = Web3Utils.toHex(strArray[i]);
      } else {
        hexString = Web3Utils.toHex('');
      }

      // Remove the 0x hex prefix
      array[i] = Web3Utils.padRight(hexString, chars).slice(2);
    }

    return array.join('');
  }
}

module.exports = Encoder;