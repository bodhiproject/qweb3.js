/* External Import */
const _ = require('lodash');
const EthjsAbi = require('ethjs-abi');
const Formatter = require('./formatter');

/* Internal Import */
const Utils = require('./utils.js');

const SEND_AMOUNT = 0;
const SEND_GASLIMIT = 250000;
const SEND_GASPRICE = 0.0000004;

class Contract {
  constructor(parent, address, abi) {
    this.parent = parent;
    this.address = Utils.trimHexPrefix(address);
    this.abi = abi;
  }

  /**
   * @dev Executes a callcontract on a view/pure method via the qtum-cli.
   * @param  {string} methodName Name of contract method
   * @param  {array} params      Parameters of contract method
   * @return {Promise}           Promise containing result object or Error
   */
  call(methodName, params) {
    const { methodArgs, senderAddress } = params;
    const { method: methodObj, args } = this.validateMethodAndArgs(methodName, methodArgs, false);

    const options = {
      method: 'callcontract',
      params: [
        this.address,
        this.constructDataHex(methodObj, args),
        senderAddress,
      ],
    };

    return this.parent.provider.request(options);
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

    const { methodArgs, amount, gasLimit, gasPrice, senderAddress } = params;
    const { method: methodObj, args } = this.validateMethodAndArgs(methodName, methodArgs, true);
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

    return this.parent.provider.request(options);
  }

  /*
  * @dev Constructs the data hex string needed for a call() or send().
  * @param methodObj The json object of the method taken from the ABI.
  * @param args The arguments for the method.
  * @return The full hex string concatenated together.
  */
  constructDataHex(methodObj, args) {
    if (!methodObj) {
      throw new Error(`methodObj should not be undefined.`);
    }

    let dataHex = '';
    dataHex = dataHex.concat(Utils.getFunctionHash(methodObj));

    let hex;
    _.each(methodObj.inputs, (item, index) => {
      switch (item.type) {
        case 'address':
          hex = Utils.addressToHex(args[index]);
          dataHex = dataHex.concat(hex);
          break;
        case 'bytes32[10]':
          hex = Utils.stringArrayToHex(args[index], 10);
          dataHex = dataHex.concat(hex);
          break;
        case 'uint8':
          hex = Utils.uint8ToHex(args[index]);
          dataHex = dataHex.concat(hex);
          break;
        case 'uint256':
          hex = Utils.uint256ToHex(args[index]);
          dataHex = dataHex.concat(hex);
          break;
      }
    });

    return dataHex;
  }

  /**
   * Search logs with given filters
   * @param  {number} fromBlock Number of from block
   * @param  {number} toBlock   Number of to block
   * @param  {string or array}  addresses   One or more addresses to search against
   * @param  {string or array}  topics      One or more topic hash to search against
   * @return {Promise}           Promise containing result object or Error
   */
  searchLogs(fromBlock, toBlock, addresses, topics) {
    // Validation
    if (!_.isNumber(fromBlock)) {
      throw new Error(`fromBlock expects a number. Got ${fromBlock} instead.`);
    }

    if (!_.isNumber(toBlock)) {
      throw new Error(`toBlock expects a number. Got ${toBlock} instead.`);
    }

    const addrObj = { addresses: undefined };

    if (_.isString(addresses)) {
      addrObj.addresses = [addresses];
    } else if (_.isArray(addresses)) {
      addrObj.addresses = addresses;
    } else {
      throw new Error('addresses expects a string or an array.');
    }

    const topicsObj = { topics: undefined };

    if (_.isString(topics)) {
      topicsObj.topics = [topics];
    } else if (_.isArray(topics)) {
      topicsObj.topics = topics;
    } else {
      throw new Error('topics expects a string or an array.');
    }

    const options = {
      method: 'searchlogs',
      params: [
        fromBlock,
        toBlock,
        addrObj,
        topicsObj,
      ],
    };

    return this.parent.provider.request(options)
      .then((results) => Formatter.searchLogOutput(results, this.abi));
  }

  /**
   * Validates arguments by ABI schema and throws errors is mismatch
   * @param  {[type]}  name   Method name
   * @param  {[type]}  params Method parameters
   * @param  {Boolean} isSend True if send() and false if call()
   * @return {object}         method JSON in ABI and processed argument array
   */
  validateMethodAndArgs(name, params, isSend) {
    const methodObj = _.find(this.abi, { name });

    // Check whether name is defined in ABI
    if (_.isUndefined(methodObj)) {
      throw new Error(`Method ${name} not defined in ABI.`);
    }

    if (methodObj.inputs.length != params.length) {
      throw new Error(`Number of arguments supplied does not match ABI number of arguments.`);
    }

    // Error out if a call method is not defined with view or constant keyword
    if (!isSend && methodObj.stateMutability !== 'view' && !methodObj.constant) {
      throw new Error(`${name} isn't defined with view or constant keyword. Use contract.send() instead.`);
    }

    let args;

    if (_.isUndefined(params)) {
      args = [];
    } else if (_.isArray(params)) {
      args = params;
    } else {
      args = [params];
    }

    return {
      method: methodObj,
      args,
    };
  }
}

module.exports = Contract;