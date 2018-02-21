const _ = require('lodash');

const HttpProvider = require('./httpprovider');
const Formatter = require('./formatter');
const Utils = require('./utils');
const Encoder = require('./encoder');
const Constants = require('./constants');

const SEND_AMOUNT = 0;
const SEND_GASLIMIT = 250000;
const SEND_GASPRICE = 0.0000004;

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

    // function hash
    const funcHash = Encoder.objToHash(methodObj, true);

    const numOfParams = methodObj.inputs.length;

    // create an array of data hex strings which will be combined at the end
    const dataHexArr = _.times(numOfParams, _.constant(null));

    // calculate start byte for dynamic data
    let dataLoc = 0;
    _.each(methodObj.inputs, (item) => {
      const type = item.type;
      if (type.match(Constants.REGEX_STATIC_ARRAY)) {
        // treat each static array as an individual slot for dynamic data location purposes
        const arrCap = _.toNumber(type.match(Constants.REGEX_NUMBER)[1]);
        dataLoc += arrCap;
      } else {
        dataLoc += 1;
      }
    });

    _.each(methodObj.inputs, (item, index) => {
      const type = item.type;
      let hex;

      if (type === Constants.BYTES
        || type === Constants.STRING
        || type.match(Constants.REGEX_DYNAMIC_ARRAY)) { // dynamic types
        let data = '';
        if (type === Constants.BYTES) {
          throw new Error('dynamics bytes conversion not implemented.');
        } else if (type === Constants.STRING) {
          throw new Error('dynamic string conversion not implemented.');
        } else if (type.match(Constants.REGEX_DYNAMIC_ARRAY)) {
          // set location of dynamic data
          const startBytesLoc = dataLoc * 32;
          hex = Encoder.uintToHex(startBytesLoc);
          dataHexArr[index] = hex;

          // construct data
          // add length of dynamic data set
          const numOfDynItems = args[index].length;
          data += Encoder.uintToHex(numOfDynItems);

          // add each hex converted item
          _.each(args[index], (dynItem) => {
            data += Encoder.encodeParam(type, dynItem);
          });

          // add the dynamic data to the end
          dataHexArr.push(data);

          // increment starting data location
          // +1 for the length of data set
          dataLoc += numOfDynItems + 1;
        }
      } else if (type === Constants.ADDRESS
        || type === Constants.BOOL
        || type.match(Constants.REGEX_UINT)
        || type.match(Constants.REGEX_INT)
        || type.match(Constants.REGEX_BYTES)
        || type.match(Constants.REGEX_STATIC_ARRAY)) { // static types
        dataHexArr[index] = Encoder.encodeParam(type, args[index]);
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
