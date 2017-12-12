import _ from 'lodash';
import Web3Utils from '../node_modules/web3-utils';

const constants = require('./constants.js');

/**
 * Parameter check at the beginning of a function
 * Throw errors if required keys are missing in params object
 * @param  {string} methodName Function name used for error message
 * @param  {object} params     params object
 * @param  {array} required    Array of key strings in params, e.g. ['resultNames', 'sender']
 * @param  {func} validators  Custom functions used to validate params
 * @return {}
 */
export function paramsCheck(methodName, params, required, validators) {
  if (_.isUndefined(params)) {
    throw new Error(`params is undefined in params of ${methodName}; expected: ${_.isEmpty(required) ? undefined : required.join(',')}`);
  }

  if (required) {
    if (_.isArray(required)) {
      _.each(required, (value) => {
        if (_.isUndefined(params[value])) {
          throw new Error(`${value} is undefined in params of ${methodName}`);
        }
      });
    } else if (_.isUndefined(params[required])) {
      throw new Error(`${required} is undefined in params of ${methodName}`);
    }
  }

  if (!_.isEmpty(validators)) {
    _.each(validators, (validFunc, key) => {
      // Check whether each validator is a function
      if (typeof validFunc !== 'function') {
        throw new Error('validators are defined but not functions ...');
      }

      // Check whether key defined in validator is in params
      if (_.indexOf(params, key) < 0) {
        throw new Error(`${key} in validator is not found in params.`);
      }

      // Run validator funcs and check result
      // If result === 'undefined', pass; otherwise throw error with message
      const error = validFunc(params[key], key);
      if (error instanceof Error) {
        throw new Error(`validation for ${key} failed; message:${error.message}`);
      }
    });
  }
}

/*
* @dev Converts a string to hex string padded-right to the number of bytes specified.
* @param _string The string to convert to hex.
* @param _paddedBytes The number of bytes to pad-right.
* @return The converted padded-right hex string.
*/
export function stringToHex(_string, _paddedBytes) {
  let hexString = Web3Utils.toHex(_string);
  if (hexString.indexOf('0x') === 0) {
    // Remove the 0x hex prefix
    hexString = hexString.slice(2); 
  }
  return Web3Utils.padRight(hexString, numOfChars(_paddedBytes));
}

/*
* @dev Converts an array of string elements (max 32 bytes) into a concatenated hex string.
* @param _stringArray The string array to convert to hex.
* @param _numOfItems The total number of items the string array should have.
* @return The converted string array to single padded-right hex string.
*/
export function stringArrayToHex(_stringArray, _numOfItems) {
  if (!Array.isArray(_stringArray)) {
    throw new Error(`_stringArray is not an array type.`);
  }

  let chars = numOfChars(32);
  let array = new Array(10);
  for (let i = 0; i < _numOfItems; i++) {
    let hexString;
    if (i < _stringArray.length - 1) {
      hexString = Web3Utils.toHex(_stringArray[i]);
    } else {
      hexString = Web3Utils.toHex('');
    }
    // Remove the 0x hex prefix
    array[i] = Web3Utils.padRight(hexString, chars).slice(2);
  }
  return array.join('');
}

/*
* @dev Converts a uint256 to hex padded-left to 32 bytes.
* @param _uint256 The number to convert.
* @return The converted uint256 to padded-left hex string.
*/
export function uint256ToHex(_uint256) {
  let hexNumber = Web3Utils.toHex(_uint256);
  return Web3Utils.padLeft(hexNumber, numOfChars(32)).slice(2);
}

/*
* @dev Returns the number of characters in the bytes specified.
* @param _bytes The number of bytes.
* @return The int number of characters given the bytes.
*/
function numOfChars(_bytes) {
  return _bytes * constants['CHARS_IN_BYTE'];
}
