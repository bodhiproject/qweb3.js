import url from 'url';
import fetch from 'node-fetch';
import _ from 'lodash';
import Utils from './utils.js';

class HttpProvider {
  constructor(urlString) {
    this.url = url.parse(urlString);
    this.reqId = 0;
  }

  request(params) {
    // Make sure method is defined in params
    Utils.paramsCheck('request', params, ['method']);

    // Construct body of request options
    const bodyJson = _.extend({
      id: this.reqId,
      jsonrpc: '1.0',
      method: '',
      params: [],
    }, params);

    // Construct options of request
    const reqOpts = {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(bodyJson),
    };

    // Add Basic Auth header if auth is defined in HttpProvider constructor
    if (this.url.auth) {
      reqOpts.headers.Authorization = `Basic ${Buffer.from(this.url.auth).toString('base64')}`;
    }

    this.reqId += 1;

    return fetch(`${this.url.protocol}//${this.url.host}`, reqOpts)
      .then(this.parseJSON)
      .then(this.checkStatus);
  }

  /**
   * Returns resolved Promise if Http response contains result; otherwise returns rejected upon error.
   * @param {object} response JSON response from a HTTP request
   * @return {object|undefined} Returns either the response, or throws an error
   */
  checkStatus(response) {
    // We can rely on checking error object so dont check HTTP status code here.
    if (response.error) {
      throw new Error(response.error.message);
    } else {
      return response.result;
    }
  }

  /**
   * Parses the JSON returned by a network request
   * @param  {object} response A response from a network request
   * @return {object} The parsed JSON from the request
   */
  parseJSON(response) {
    return response.json();
  }
}

module.exports = HttpProvider;
