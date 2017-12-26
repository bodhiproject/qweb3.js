const Web3Utils = require('web3-utils');
const Utils = require('./utils');

const CHARS_TO_CHUNK = 64;
const EVENTNAME_ARRAY_CAPACITY = 10;

class Encoder {

  /*
   * Converts an array of string elements (max 32 bytes) into a concatenated hex string.
   * @param strArray The string array to convert to hex.
   * @param numOfItems The total number of items the string array should have.
   * @return The converted string array to single padded-right hex string.
   */
  function stringToHex(string) {
    if (string === undefined) {
      throw new Error(`string should not be undefined`);
    }

    let hexString = Web3Utils.toHex(string).slice(2);
    hexString = Web3Utils.padRight(hexString, CHARS_TO_CHUNK * EVENTNAME_ARRAY_CAPACITY);

    const hexArray = Utils.chunkString(hexString, CHARS_TO_CHUNK).slice(EVENTNAME_ARRAY_CAPACITY);

    return hexArray.join('');
  }
}

module.exports = Encoder;