/* External Import */
import _ from 'lodash';
import EthjsAbi from 'ethjs-abi';
import web3 from 'web3';

/* Internal Import */
import { paramsCheck, stringToHex, stringArrayToHex, uint256ToHex } from './utils';

const SEND_AMOUNT = 0;
const SEND_GASLIMIT = 250000;
const SEND_GASPRICE = 0.0000004;

class Contract {
  constructor(parent, address, abi) {
    this.parent = parent;
    this.address = address;
    this.abi = abi;
  }

  /**
   * Call a constant or view contract method by name
   * @param  {string} methodName Name of contract method
   * @param  {array} params      Parameters of contract method
   * @return {Promise}           Promise containing result object or Error
   */
  call(methodName, params) {
    const { method: methodObj, args } = this.validateMethodAndArgs(methodName, params, false /* isSend */);

    // Convert string into bytes or bytes32[] according to ABI definition
    _.each(methodObj.inputs, (item, index) => {
      if (item.type === 'bytes') {
        args[index] = web3.utils.toHex(args[index]);
      } else if (item.type === 'bytes32[]') {
        args[index] = _.map(args[index], value => web3.utils.toHex(value));
      }
    });

    // Encoding dataHex and remove "0x" in the front.
    const dataHex = EthjsAbi.encodeMethod(methodObj, args).slice(2);

    const options = {
      method: 'callcontract',
      params: [
        this.address,
        dataHex,
      ],
    };

    return this.parent.provider.request(options);
  }

  /**
   * Send to a contract method by name
   * @param  {string} methodName Name of contract method
   * @param  {array} params      Parameters of contract method
   *                             senderAddress {string} - required
   *                             data {array} - used to construct dataHex,required
   *                             amount {number} - optional
   *                             gasLimit {number} - optional
   *                             gasPrice {number} - optional
   *
   * @return {Promise}           Promise containing result object or Error
   */
  // send(methodName, params) {
  //   // Error out if senderAddress or data is not defined in params
  //   paramsCheck('send', params, ['senderAddress', 'data']);

  //   const {
  //     senderAddress, data, amount, gasLimit, gasPrice,
  //   } = params;
  //   const { method: methodObj, args } = this.validateMethodAndArgs(methodName, data, true /* isSend */);

  //   // Convert string into bytes or bytes32[] according to ABI definition
  //   _.each(methodObj.inputs, (item, index) => {
  //     if (item.type === 'bytes') {
  //       args[index] = web3.utils.toHex(args[index]);
  //     } else if (item.type === 'bytes32[]') {
  //       args[index] = _.map(args[index], value => web3.utils.toHex(value));
  //     }
  //   });

  //   // Encoding dataHex and remove "0x" in the front.
  //   const dataHex = EthjsAbi.encodeMethod(methodObj, args).slice(2);

  //   const options = {
  //     method: 'sendtocontract',
  //     params: [
  //       this.address,
  //       dataHex,
  //       amount || SEND_AMOUNT,
  //       gasLimit || SEND_GASLIMIT,
  //       gasPrice || SEND_GASPRICE,
  //       senderAddress,
  //     ],
  //   };

  //   return this.parent.provider.request(options);
  // }

  send(methodName, args, amount, gasLimit, gasPrice, senderAddress) {
    const methodObj = _.find(this.abi, { methodName });
    console.log(methodObj);

    if (methodObj.inputs.length != args.length) {
      throw new Error(`Number of arguments supplied does not match ABI number of arguments.`);
    }
    if (_.isUndefined(senderAddress)) {
      throw new Error(`Sender address should not be undefined.`);
    }

    let hex;
    let dataHex = '';

    // TODO: hash this here later
    const functionSig = 'd0613dce';
    dataHex = dataHex.concat(functionSig);

    _.each(methodObj.inputs, (item, index) => {
      if (item.type === 'address') {
        hex = '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3';
        dataHex = dataHex.concat(hex);
      } else if (item.type === 'bytes32[10]') {
        hex = stringArrayToHex(args[index], 10);
        dataHex = dataHex.concat(hex);
      } else if (item.type === 'uint256') {
        hex = uint256ToHex(args[index]);
        dataHex = dataHex.concat(hex);
      }
    });

    const options = {
      method: 'sendtocontract',
      params: [
        this.address,
        dataHex,
        amount || SEND_AMOUNT,
        gasLimit || SEND_GASLIMIT,
        gasPrice || SEND_GASPRICE,
        senderAddress,
      ],
    };
    
    return this.parent.provider.request(options);
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

    return this.parent.provider.request(options);
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

export default Contract;
