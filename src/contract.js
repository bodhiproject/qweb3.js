const _ = require('lodash');

const HttpProvider = require('./httpprovider');
const Formatter = require('./formatter');
const Utils = require('./utils');
const Encoder = require('./encoder');

const SEND_AMOUNT = 0;
const SEND_GASLIMIT = 250000;
const SEND_GASPRICE = 0.0000004;

const MAX_BYTES_PER_ARRAY_SLOT = 64;

const TYPE_ADDRESS = 'address';
const TYPE_BOOL = 'bool';
const TYPE_BYTES = 'bytes';
const TYPE_STRING = 'string';
const REGEX_UINT = /^uint\d+/;
const REGEX_INT = /^int\d+/;
const REGEX_BYTES = /bytes([1-9]|[12]\d|3[0-2])$/;
const REGEX_BYTES_ARRAY = /bytes([1-9]|[12]\d|3[0-2])(\[[0-9]+\])$/;
const REGEX_NUMBER = /[0-9]+/g;
const REGEX_DYNAMIC_ARRAY = /\[\]/;

class Contract {
  constructor(url, address, abi) {
    this.provider = new HttpProvider(url);
    this.address = Utils.trimHexPrefix(address);
    this.abi = abi;
  }

  /**
   * @dev Executes a callcontract on a view/pure method via the qtum-cli.
   * @param {string} methodName Name of contract method
   * @param {array} params Parameters of contract method
   * @return {Promise} Promise containing result object or Error
   */
  call(methodName, params) {
    const { methodArgs, senderAddress } = params;
    const { method: methodObj, args } = this.validateMethodAndArgs(methodName, methodArgs);

    const options = {
      method: 'callcontract',
      params: [
        this.address,
        this.constructDataHex(methodObj, args),
        senderAddress,
      ],
    };

    return this.provider.request(options)
      .then(result => Formatter.callOutput(result, this.abi, methodName, true));
  }

  /*
  * @dev Executes a sendtocontract on this contract via the qtum-cli.
  * @param methodName Method name to execute as a string.
  * @param params Parameters of the contract method.
  * @return The transaction id of the sendtocontract.
  */
  send(methodName, params) {
    // Throw if methodArgs or senderAddress is not defined in params
    Utils.paramsCheck('send', params, ['methodArgs', 'senderAddress']);

    const {
      methodArgs, amount, gasLimit, gasPrice, senderAddress,
    } = params;
    const { method: methodObj, args } = this.validateMethodAndArgs(methodName, methodArgs);
    const options = {
      method: 'sendtocontract',
      params: [
        this.address,
        this.constructDataHex(methodObj, args),
        amount || SEND_AMOUNT,
        gasLimit || SEND_GASLIMIT,
        gasPrice || SEND_GASPRICE,
        senderAddress,
      ],
    };

    return this.provider.request(options);
  }

  /*
  * @dev Constructs the data hex string needed for a call() or send().
  * @param methodObj The json object of the method taken from the ABI.
  * @param args The arguments for the method.
  * @return The full hex string concatenated together.
  */
  constructDataHex(methodObj, args) {
    if (!methodObj) {
      throw new Error('methodObj should not be undefined.');
    }

    const numOfParams = methodObj.inputs.length;

    // function hash
    const funcHash = Encoder.objToHash(methodObj, true);

    // create an array of hex strings which will be combined at the end
    let dataHexArr = _.times(numOfParams, _.constant(null));

    // starting location for dynamic data
    let dataLoc = numOfParams;

    _.each(methodObj.inputs, (item, index) => {
      const type = item.type;
      let hex;

      if (type === TYPE_BYTES
        || type === TYPE_STRING
        || type.match(REGEX_DYNAMIC_ARRAY)) { // dynamic types

        let data;
        if (type === TYPE_BYTES) {
          console.error('dynamics bytes conversion not implemented.');
        } else if (type === TYPE_STRING) {
          console.error('dynamic string conversion not implemented.');
        } else if (type.match(REGEX_DYNAMIC_ARRAY)) {
          // set location of dynamic data
          const startBytesLoc = dataLoc * 32;
          hex = Encoder.uintToHex(startBytesLoc);
          dataHexArr[index] = hex;

          // set data in proper location
          _.each(args[index], (dynItem) => {
            
          });
        }

      } else if (type === TYPE_ADDRESS 
        || type === TYPE_BOOL
        || type.match(REGEX_UINT) 
        || type.match(REGEX_INT) 
        || type.match(REGEX_BYTES_ARRAY)
        || type.match(REGEX_BYTES)) { // static types

        if (type === TYPE_ADDRESS) {
          hex = Encoder.addressToHex(args[index]);
        } else if (type === TYPE_BOOL) {
          hex = Encoder.boolToHex(args[index]);
        } else if (type.match(REGEX_UINT)) {
          hex = Encoder.uintToHex(args[index]);
        } else if (type.match(REGEX_INT)) {
          hex = Encoder.intToHex(args[index]);
        } else if (type.match(REGEX_BYTES_ARRAY)) { // fixed bytes array, ie. bytes32[10]
          const arrCapacity = _.toNumber(type.match(REGEX_NUMBER)[1]);
          if (args[index] instanceof Array) {
            hex = Encoder.stringArrayToHex(args[index], arrCapacity);
          } else {
            hex = Encoder.stringToHex(args[index], MAX_BYTES_PER_ARRAY_SLOT * arrCapacity);
          }
        } else if (type.match(REGEX_BYTES)) { // fixed bytes, ie. bytes32
          hex = Encoder.stringToHex(args[index], MAX_BYTES_PER_ARRAY_SLOT);
        } 
        dataHexArr[index] = hex;

      } else {
        console.error(`found unknown type: ${type}`);
      }
    });

    return funcHash + dataHexArr.join('');
  }

  /**
   * Validates arguments by ABI schema and throws errors if mismatch.
   * @param {String} methodName The method name.
   * @param {Array} methodArgs The method arguments.
   * @return {Object} The method object in ABI and processed argument array.
   */
  validateMethodAndArgs(methodName, methodArgs) {
    const methodObj = _.find(this.abi, { name: methodName });

    if (_.isUndefined(methodObj)) {
      throw new Error(`Method ${methodName} not defined in ABI.`);
    }
    if (methodObj.inputs.length != methodArgs.length) {
      throw new Error('Number of arguments supplied does not match ABI method args.');
    }

    let args;
    if (_.isUndefined(methodArgs)) {
      args = [];
    } else if (_.isArray(methodArgs)) {
      args = methodArgs;
    } else {
      args = [methodArgs];
    }

    return {
      method: methodObj,
      args,
    };
  }
}

module.exports = Contract;
