import _ from 'lodash';

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

/**
 * Validate format string and append '0x' to it if there's not one.
 * @param  {string} value  Hex string to format
 * @return {string}       
 */
export function formatHexStr(value) {

  // TODO: validate format of hex string
  if (_.startsWith(value, '0x')) {
    return value;
  } else {
    return "0x" + value;
  }
}