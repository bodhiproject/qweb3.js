const _ = require('lodash');
const url = require('url');
const axios = require('axios');

const Utils = require('./utils');

/**
 * HTTP Provider for interacting with the blockchain via JSONRPC POST calls.
 */
class HttpProvider {
  /**
   * Constructor.
   * @param {string} urlString URL of the blockchain access point. eg. http://bodhi:bodhi@127.0.0.1:13889
   */
  constructor(urlString) {
    this.url = url.parse(urlString);
  }

  /**
   * Executes a request to the blockchain.
   * @param {string} method Blockchain method to call. eg. 'sendtocontract'
   * @param {array} args Raw arguments for the call. [contractAddress, data, amount, gasLimit, gasPrice]
   */
  async rawCall(method, args = []) {
    if (_.isEmpty(method)) {
      throw Error('method cannot be empty.');
    }

    // Construct body
    const body = {
      id: new Date().getTime(),
      jsonrpc: '1.0',
      method,
      params: args,
    };

    // Execute POST request
    const { result, error } = (await axios({
      method: 'post',
      url: `${this.url.protocol}//${this.url.host}`,
      headers: {
        'Content-Type': 'text/plain',
        Authorization: `Basic ${Buffer.from(this.url.auth).toString('base64')}`,
      },
      data: JSON.stringify(body),
    })).data;

    // Handle error
    if (error) {
      throw Error(error);
    }

    return result;
  }

  async request(params) {
    // Make sure method is defined in params
    Utils.paramsCheck('request', params, ['method']);
    console.log(params);

    // Construct body
    const postBody = _.extend({
      id: new Date().getTime(),
      jsonrpc: '1.0',
      method: '',
      params: [],
    }, params);

    // Execute POST request
    const { result, error } = (await axios({
      method: 'post',
      url: `${this.url.protocol}//${this.url.host}`,
      headers: {
        'Content-Type': 'text/plain',
        Authorization: `Basic ${Buffer.from(this.url.auth).toString('base64')}`,
      },
      data: JSON.stringify(postBody),
    })).data;

    // Handle error
    if (error) {
      throw Error(error);
    }

    return result;
  }
}

module.exports = HttpProvider;
