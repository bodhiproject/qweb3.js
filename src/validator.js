class Validator {

  static isString(str) {
    return typeof str === 'string' || str instanceof String;
  }

  static isNumber(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
  }
}

module.exports = Validator;
