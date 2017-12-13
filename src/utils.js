const BigNumber = require('bignumber.js');
const utf8 = require('utf8');
const _ = require('lodash');
const Web3Utils = require('web3-utils');

const constants = require('./constants.js');
const bs58 = require('bs58');

var unitMap = {
  'noether': '0',
  'wei': '1',
  'kwei': '1000',
  'Kwei': '1000',
  'babbage': '1000',
  'femtoether': '1000',
  'mwei': '1000000',
  'Mwei': '1000000',
  'lovelace': '1000000',
  'picoether': '1000000',
  'gwei': '1000000000',
  'Gwei': '1000000000',
  'shannon': '1000000000',
  'nanoether': '1000000000',
  'nano': '1000000000',
  'szabo': '1000000000000',
  'microether': '1000000000000',
  'micro': '1000000000000',
  'finney': '1000000000000000',
  'milliether': '1000000000000000',
  'milli': '1000000000000000',
  'ether': '1000000000000000000',
  'kether': '1000000000000000000000',
  'grand': '1000000000000000000000',
  'mether': '1000000000000000000000000',
  'gether': '1000000000000000000000000000',
  'tether': '1000000000000000000000000000000'
};

/**
 * Should be called to pad string to expected length
 *
 * @method padLeft
 * @param {String} string to be padded
 * @param {Number} characters that result string should have
 * @param {String} sign, by default 0
 * @returns {String} right aligned string
 */
var padLeft = function(string, chars, sign) {
  return new Array(chars - string.length + 1).join(sign ? sign : "0") + string;
};

/**
 * Should be called to pad string to expected length
 *
 * @method padRight
 * @param {String} string to be padded
 * @param {Number} characters that result string should have
 * @param {String} sign, by default 0
 * @returns {String} right aligned string
 */
var padRight = function(string, chars, sign) {
  return string + (new Array(chars - string.length + 1).join(sign ? sign : "0"));
};

/**
 * Should be called to get utf8 from it's hex representation
 *
 * @method toUtf8
 * @param {String} string in hex
 * @returns {String} ascii string representation of hex value
 */
var toUtf8 = function(hex) {
  // Find termination
  var str = "";
  var i = 0,
    l = hex.length;
  if (hex.substring(0, 2) === '0x') {
    i = 2;
  }
  for (; i < l; i += 2) {
    var code = parseInt(hex.substr(i, 2), 16);
    if (code === 0)
      break;
    str += String.fromCharCode(code);
  }

  return utf8.decode(str);
};



/**
 * Should be called to get hex representation (prefixed by 0x) of utf8 string
 *
 * @method fromUtf8
 * @param {String} string
 * @param {Number} optional padding
 * @returns {String} hex representation of input string
 */
var fromUtf8 = function(str) {
  str = utf8.encode(str);
  var hex = "";
  for (var i = 0; i < str.length; i++) {
    var code = str.charCodeAt(i);
    if (code === 0)
      break;
    var n = code.toString(16);
    hex += n.length < 2 ? '0' + n : n;
  }

  return "0x" + hex;
};

/**
 * Should be called to get hex representation (prefixed by 0x) of ascii string
 *
 * @method fromAscii
 * @param {String} string
 * @param {Number} optional padding
 * @returns {String} hex representation of input string
 */
var fromAscii = function(str) {
  var hex = "";
  for (var i = 0; i < str.length; i++) {
    var code = str.charCodeAt(i);
    var n = code.toString(16);
    hex += n.length < 2 ? '0' + n : n;
  }

  return "0x" + hex;
};

/**
 * Should be used to create full function/event name from json abi
 *
 * @method transformToFullName
 * @param {Object} json-abi
 * @return {String} full fnction/event name
 */
var transformToFullName = function(json) {
  if (json.name.indexOf('(') !== -1) {
    return json.name;
  }

  var typeName = json.inputs.map(function(i) { return i.type; }).join();
  return json.name + '(' + typeName + ')';
};

/**
 * Should be called to get display name of contract function
 *
 * @method extractDisplayName
 * @param {String} name of function/event
 * @returns {String} display name for function/event eg. multiply(uint256) -> multiply
 */
var extractDisplayName = function(name) {
  var length = name.indexOf('(');
  return length !== -1 ? name.substr(0, length) : name;
};

/// @returns overloaded part of function/event name
var extractTypeName = function(name) {
  /// TODO: make it invulnerable
  var length = name.indexOf('(');
  return length !== -1 ? name.substr(length + 1, name.length - 1 - (length + 1)).replace(' ', '') : "";
};

/**
 * Converts value to it's decimal representation in string
 *
 * @method toDecimal
 * @param {String|Number|BigNumber}
 * @return {String}
 */
var toDecimal = function(value) {
  return toBigNumber(value).toNumber();
};

/**
 * Converts value to it's hex representation
 *
 * @method fromDecimal
 * @param {String|Number|BigNumber}
 * @return {String}
 */
var fromDecimal = function(value) {
  var number = toBigNumber(value);
  var result = number.toString(16);

  return number.lessThan(0) ? '-0x' + result.substr(1) : '0x' + result;
};


/**
 * @method getValueOfUnit
 * @param  {string} unit the unit to convert to, default ether
 * @return {BigNumber} value of the unit (in Wei)
 * @throws error if the unit not correct
 */
var getValueOfUnit = function(unit) {
  unit = unit ? unit.toLowerCase() : 'ether';
  var unitValue = unitMap[unit];

  if (unitValue === undefined) {
    throw new Error('This unit doesn\'t exists, please use the one of the following units' + JSON.stringify(unitMap, null, 2));
  }

  return new BigNumber(unitValue, 10);
};

/**
 * Takes a number of wei and converts it to any other ether unit.
 *
 * Possible units are:
 *   SI Short   SI Full        Effigy       Other
 * - kwei       femtoether     babbage
 * - mwei       picoether      lovelace
 * - gwei       nanoether      shannon      nano
 * - --         microether     szabo        micro
 * - --         milliether     finney       milli
 * - ether      --             --
 * - kether                    --           grand
 * - mether
 * - gether
 * - tether
 *
 * @method fromWei
 * @param {Number|String} number can be a number, number string or a HEX of a decimal
 * @param {String} unit the unit to convert to, default ether
 * @return {String|Object} When given a BigNumber object it returns one as well, otherwise a number
 */
var fromWei = function(number, unit) {
  var returnValue = toBigNumber(number).dividedBy(getValueOfUnit(unit));

  return isBigNumber(number) ? returnValue : returnValue.toString(10);
};

/**
 * Takes a number of a unit and converts it to wei.
 *
 * Possible units are:
 *   SI Short   SI Full        Effigy       Other
 * - kwei       femtoether     babbage
 * - mwei       picoether      lovelace
 * - gwei       nanoether      shannon      nano
 * - --         microether     szabo        micro
 * - --         milliether     finney       milli
 * - ether      --             --
 * - kether                    --           grand
 * - mether
 * - gether
 * - tether
 *
 * @method toWei
 * @param {Number|String|BigNumber} number can be a number, number string or a HEX of a decimal
 * @param {String} unit the unit to convert from, default ether
 * @return {String|Object} When given a BigNumber object it returns one as well, otherwise a number
 */
var toWei = function(number, unit) {
  var returnValue = toBigNumber(number).times(getValueOfUnit(unit));

  return isBigNumber(number) ? returnValue : returnValue.toString(10);
};

/**
 * Takes an input and transforms it into an bignumber
 *
 * @method toBigNumber
 * @param {Number|String|BigNumber} a number, string, HEX string or BigNumber
 * @return {BigNumber} BigNumber
 */
var toBigNumber = function(number) {
  /*jshint maxcomplexity:5 */
  number = number || 0;
  if (isBigNumber(number))
    return number;

  if (isString(number) && (number.indexOf('0x') === 0 || number.indexOf('-0x') === 0)) {
    return new BigNumber(number.replace('0x', ''), 16);
  }

  return new BigNumber(number.toString(10), 10);
};

/**
 * Takes and input transforms it into bignumber and if it is negative value, into two's complement
 *
 * @method toTwosComplement
 * @param {Number|String|BigNumber}
 * @return {BigNumber}
 */
var toTwosComplement = function(number) {
  var bigNumber = toBigNumber(number).round();
  if (bigNumber.lessThan(0)) {
    return new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16).plus(bigNumber).plus(1);
  }
  return bigNumber;
};

/**
 * Checks if the given string is strictly an address
 *
 * @method isStrictAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
 */
var isStrictAddress = function(address) {
  return /^0x[0-9a-f]{40}$/i.test(address);
};

/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
 */
var isAddress = function(address) {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // check if it has the basic requirements of an address
    return false;
  } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
    // If it's all small caps or all all caps, return true
    return true;
  } else {
    // Otherwise check each case
    return isChecksumAddress(address);
  }
};

/**
 * Transforms given string to valid 20 bytes-length addres with 0x prefix
 *
 * @method toAddress
 * @param {String} address
 * @return {String} formatted address
 */
var toAddress = function(address) {
  if (isStrictAddress(address)) {
    return address;
  }

  if (/^[0-9a-f]{40}$/.test(address)) {
    return '0x' + address;
  }

  return '0x' + padLeft(toHex(address).substr(2), 40);
};

/**
 * Returns true if object is BigNumber, otherwise false
 *
 * @method isBigNumber
 * @param {Object}
 * @return {Boolean}
 */
var isBigNumber = function(object) {
  return object instanceof BigNumber ||
    (object && object.constructor && object.constructor.name === 'BigNumber');
};

/**
 * Returns true if object is string, otherwise false
 *
 * @method isString
 * @param {Object}
 * @return {Boolean}
 */
var isString = function(object) {
  return typeof object === 'string' ||
    (object && object.constructor && object.constructor.name === 'String');
};

/**
 * Returns true if object is Objet, otherwise false
 *
 * @method isObject
 * @param {Object}
 * @return {Boolean}
 */
var isObject = function(object) {
  return object !== null && !(Array.isArray(object)) && typeof object === 'object';
};

/**
 * Returns true if object is boolean, otherwise false
 *
 * @method isBoolean
 * @param {Object}
 * @return {Boolean}
 */
var isBoolean = function(object) {
  return typeof object === 'boolean';
};

/**
 * Returns true if object is array, otherwise false
 *
 * @method isArray
 * @param {Object}
 * @return {Boolean}
 */
var isArray = function(object) {
  return Array.isArray(object);
};

/**
 * Returns true if given string is valid json object
 *
 * @method isJson
 * @param {String}
 * @return {Boolean}
 */
var isJson = function(str) {
  try {
    return !!JSON.parse(str);
  } catch (e) {
    return false;
  }
};

/**
 * Returns true if given string is a valid log topic.
 *
 * @method isTopic
 * @param {String} hex encoded topic
 * @return {Boolean}
 */
var isTopic = function(topic) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(topic)) {
    return false;
  } else if (/^(0x)?[0-9a-f]{64}$/.test(topic) || /^(0x)?[0-9A-F]{64}$/.test(topic)) {
    return true;
  }
  return false;
};

/**
 * Parameter check at the beginning of a function
 * Throw errors if required keys are missing in params object
 * @param  {string} methodName Function name used for error message
 * @param  {object} params     params object
 * @param  {array} required    Array of key strings in params, e.g. ['resultNames', 'sender']
 * @param  {func} validators  Custom functions used to validate params
 * @return {}
 */
function paramsCheck(methodName, params, required, validators) {
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

class Utils {

  /**
   * Auto converts any given value into it's hex representation.
   *
   * And even stringifys objects before.
   *
   * @method toHex
   * @param {String|Number|BigNumber|Object}
   * @return {String}
   */
  static toHex(val) {
    /*jshint maxcomplexity: 8 */

    if (_.isBoolean(val))
      return fromDecimal(+val);

    if (isBigNumber(val))
      return fromDecimal(val);

    if (typeof val === 'object')
      return fromUtf8(JSON.stringify(val));

    // if its a negative number, pass it through fromDecimal
    if (isString(val)) {
      if (val.indexOf('-0x') === 0)
        return fromDecimal(val);
      else if (val.indexOf('0x') === 0)
        return val;
      else if (!isFinite(val))
        return fromAscii(val);
    }

    return fromDecimal(val);
  };

  /**
   * Validate format string and append '0x' to it if there's not one.
   * @param  {string} value  Hex string to format
   * @return {string}
   */
  static formatHexStr(value) {
    // TODO: validate format of hex string
    if (_.startsWith(value, '0x')) {
      return value;
    } else {
      return "0x" + value;
    }
  }

  /**
   * Should be called to get ascii from it's hex representation
   *
   * @method toAscii
   * @param {String} string in hex
   * @returns {String} ascii string representation of hex value
   */
  static toAscii(hex) {
    // Find termination
    var str = "";
    var i = 0,
      l = hex.length;
    if (hex.substring(0, 2) === '0x') {
      i = 2;
    }
    for (; i < l; i += 2) {
      var code = parseInt(hex.substr(i, 2), 16);
      str += String.fromCharCode(code);
    }

    return str;
  };
}

/*
 * @dev Converts an object of a method from the ABI to a function hash.
 * @param methodObj The json object of the method taken from the ABI.
 * @return The function hash.
 */
function getFunctionHash(methodObj) {
  if (!methodObj) {
    throw new Error(`methodObj should not be undefined.`);
  }

  let name = methodObj.name;
  let params = '';
  for (let i = 0; i < methodObj.inputs.length; i++) {
    params = params.concat(methodObj.inputs[i].type);

    if (i < methodObj.inputs.length - 1) {
      params = params.concat(',');
    }
  };
  let signature = name.concat('(').concat(params).concat(')');

  // Return only the first 4 bytes
  return Web3Utils.sha3(signature).slice(2, 10);
}

/*
 * @dev Converts a Qtum address to hex string.
 * @param address The Qtum address to convert.
 * @return The 32 bytes padded-left hex string.
 */
function addressToHex(address) {
  if (!address) {
    throw new Error(`address should not be undefined.`);
  }

  const bytes = bs58.decode(address);
  let hexStr = bytes.toString('hex');

  // Removes:
  // First byte = version
  // Last 4 bytes = checksum
  hexStr = hexStr.slice(2, 42);

  return Web3Utils.padLeft(hexStr, numOfChars(32));
}

/*
 * @dev Converts a string to hex string padded-right to the number of bytes specified.
 * @param str The string to convert to hex.
 * @param paddedBytes The number of bytes to pad-right.
 * @return The converted padded-right hex string.
 */
function stringToHex(str, paddedBytes) {
  if (paddedBytes <= 0) {
    throw new Error(`paddedBytes should be greater than 0.`);
  }

  let hexString = Web3Utils.toHex(str);
  if (hexString.indexOf('0x') === 0) {
    // Remove the 0x hex prefix
    hexString = hexString.slice(2);
  }
  return Web3Utils.padRight(hexString, numOfChars(paddedBytes));
}

/*
 * @dev Converts an array of string elements (max 32 bytes) into a concatenated hex string.
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
    if (i < strArray.length - 1) {
      hexString = Web3Utils.toHex(strArray[i]);
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
 * @param uint256 The number to convert.
 * @return The converted uint256 to padded-left hex string.
 */
function uint8ToHex(uint8) {
  let hexNumber = Web3Utils.toHex(uint8);
  return Web3Utils.padLeft(hexNumber, numOfChars(32)).slice(2);
}

/*
 * @dev Converts a uint256 to hex padded-left to 32 bytes.
 * @param uint256 The number to convert.
 * @return The converted uint256 to padded-left hex string.
 */
function uint256ToHex(uint256) {
  let hexNumber = Web3Utils.toHex(uint256);
  return Web3Utils.padLeft(hexNumber, numOfChars(32)).slice(2);
}

/*
 * @dev Returns the number of characters in the bytes specified.
 * @param bytes The number of bytes.
 * @return The int number of characters given the bytes.
 */
function numOfChars(bytes) {
  return bytes * constants['CHARS_IN_BYTE'];
}

module.exports = {
  paramsCheck: paramsCheck,
  getFunctionHash: getFunctionHash,
  addressToHex: addressToHex,
  stringToHex: stringToHex,
  stringArrayToHex: stringArrayToHex,
  uint8ToHex: uint8ToHex,
  uint256ToHex: uint256ToHex,
};