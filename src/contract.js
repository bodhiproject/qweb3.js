import _ from 'lodash';
import abi from 'ethjs-abi';
import web3 from 'web3';

import { paramsCheck } from './utils';

const SEND_AMOUNT = 0;
const SEND_GASLIMIT = 250000;
const SEND_GASPRICE = 0.0000004;

class Contract {

  constructor(parent, address, abi) {

    this.parent = parent,
      this.address = address,
      this.abi = abi;
  }

  /**
   * Implementation of callcontract
   * @param  {[type]} methodName [description]
   * @param  {[type]} params     [description]
   * @return {[type]}            [description]
   */
  call(methodName, params) {

    const { method: methodObj, args } = this.validateMethodAndArgs(methodName, params, false /*isSend*/ );

    // Convert string into bytes or bytes32[] according to ABI definition
    _.each(methodObj.inputs, (item, index) => {
      if (item.type === 'bytes') {
        args[index] = web3.utils.toHex(args[index]);
      } else if (item.type === 'bytes32[]') {
        args[index] = _.map(args[index], (value) => web3.utils.toHex(value));
      }
    });

    // Encoding dataHex and remove "0x" in the front.
    const dataHex = abi.encodeMethod(methodObj, args).slice(2);

    let options = {
      method: 'callcontract',
      params: [
        this.address,
        dataHex
      ]
    };

    return this.parent.provider.request(options);
  }

  /**
   * Implementation of sendtocontract
   * @param  {[type]} methodName [description]
   * @param  {[type]} params     [description]
   * @return {[type]}            [description]
   */
  send(methodName, params) {

    // Error out if senderAddress or data is not defined in params
    paramsCheck('send', params, ['senderAddress', 'data']);

    const { senderAddress, data, amount, gasLimit, gasPrice } = params;
    const { method: methodObj, args } = this.validateMethodAndArgs(methodName, data, true /*isSend*/ );

    // Convert string into bytes or bytes32[] according to ABI definition
    _.each(methodObj.inputs, (item, index) => {
      if (item.type === 'bytes') {
        args[index] = web3.utils.toHex(args[index]);
      } else if (item.type === 'bytes32[]') {
        args[index] = _.map(args[index], (value) => web3.utils.toHex(value));
      }
    });

    // Encoding dataHex and remove "0x" in the front.
    const dataHex = abi.encodeMethod(methodObj, args).slice(2);

    let options = {
      method: 'sendtocontract',
      params: [
        this.address,
        dataHex,
        amount || SEND_AMOUNT,
        gasLimit || SEND_GASLIMIT,
        gasPrice || SEND_GASPRICE,
        senderAddress
      ]
    };

    return this.parent.provider.request(options);
  }

  searchLogs(fromBlock, toBlock, addresses, topics) {

    // Validation
    if (!_.isNumber(fromBlock)) {
      throw new Error(`fromBlock expects a number. Got ${fromBlock} instead.`);
    }

    if (!_.isNumber(toBlock)) {
      throw new Error(`toBlock expects a number. Got ${toBlock} instead.`);

    }

    let addrObj = { "addresses": undefined };

    if (_.isString(addresses)) {
      addrObj.addresses = [addresses];
    } else if (_.isArray(addresses)) {
      addrObj.addresses = addresses;
    } else {
      throw new Error(`addresses expects a string or an array.`);
    }

    let topicsObj = { "topics": undefined };

    if (_.isString(topics)) {
      topicsObj.topics = [topics];
    } else if (_.isArray(topics)) {
      topicsObj.topics = topics;
    } else {
      throw new Error(`topics expects a string or an array.`);
    }

    let options = {
      method: 'searchlogs',
      params: [
        fromBlock,
        toBlock,
        addrObj,
        topicsObj
      ]
    };

    return this.parent.provider.request(options);
  }

  validateMethodAndArgs(name, params, isSend) {

    let methodObj = _.find(this.abi, { name: name });

    // Check whether name is defined in ABI
    if (_.isUndefined(methodObj)) {
      throw new Error(`Method ${name} not defined in ABI.`);
    }

    // Error out if a call method is not defined with view or constant keyword
    if (!isSend && methodObj.stateMutability !== "view" && !methodObj.constant) {
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
      args
    };

    // TODO: do we need to validate
    // 
  }
}

export default Contract;