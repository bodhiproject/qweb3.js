const _ = require('lodash');
const utf8 = require('utf8');

class Utils {
  /**
   * Parameter check at the beginning of a function
   * Throw errors if required keys are missing in params object
   * @param  {string} methodName Function name used for error message
   * @param  {object} params     params object
   * @param  {array} required    Array of key strings in params, e.g. ['resultNames', 'sender']
   * @param  {func} validators  Custom functions used to validate params
   * @return {}
   */
  static paramsCheck(methodName, params, required, validators) {
    if (_.isUndefined(params)) {
      throw new Error(`params is undefined in params of ${methodName}; expected: ${_.isEmpty(required)
        ? undefined : required.join(',')}`);
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

  /**
   * Validate format string and append '0x' to it if there's not one.
   * @param  {string} value  Hex string to format
   * @return {string}
   */
  static appendHexPrefix(value) {
    if (_.startsWith(value, '0x')) {
      return value;
    }
    return `0x${value}`;
  }

  /*
  * Removes the '0x' hex prefix if necessary.
  * @param str The string to remove the prefix from.
  * @return The str without the hex prefix.
  */
  static trimHexPrefix(str) {
    if (str && str.indexOf('0x') === 0) {
      return str.slice(2);
    }
    return str;
  }

  /*
   * Breaks down a string by {length} and returns an array of string
   * @param {string} Input string
   * @param {number} Length of each chunk.
   * @return {array} broken-down string array
   */
  static chunkString(str, length) {
    return str.match(new RegExp(`.{1,${length}}`, 'g'));
  }

  /**
   * Should be called to get utf8 from it's hex representation
   *
   * @method toUtf8
   * @param {String} string in hex
   * @returns {String} ascii string representation of hex value
   */
  static toUtf8(hex) {
    // Find termination
    let str = '';
    let i = 0,
      l = hex.length;
    if (hex.substring(0, 2) === '0x') {
      i = 2;
    }
    for (; i < l; i += 2) {
      const code = parseInt(hex.substr(i, 2), 16);
      if (code === 0) { break; }
      str += String.fromCharCode(code);
    }

    return utf8.decode(str);
  }

  /**
   * Should be called to get hex representation (prefixed by 0x) of utf8 string
   *
   * @method fromUtf8
   * @param {String} string
   * @param {Number} optional padding
   * @returns {String} hex representation of input string
   */
  static fromUtf8(str) {
    str = utf8.encode(str);
    let hex = '';
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code === 0) { break; }
      const n = code.toString(16);
      hex += n.length < 2 ? `0${n}` : n;
    }

    return `0x${hex}`;
  }

  /**
   * Returns true if given string is valid json object
   *
   * @method isJson
   * @param {String}
   * @return {Boolean}
   */
  static isJson(str) {
    try {
      return !!JSON.parse(str);
    } catch (e) {
      return false;
    }
  }

  /**
   * Returns true if given string is valid qtum address
   *
   * @method isQtumAddress
   * @param {String}
   * @return {Boolean}
   */
  static isQtumAddress(address) {
    if (_.isUndefined(address)){
      return false;
    }

    if (_.size(address) !== 34) {
      return false;
    };

    if (!address.startsWith('q') && !address.startsWith('Q')) {
      return false;
    }

    return true;
  }
}

module.exports = Utils;
